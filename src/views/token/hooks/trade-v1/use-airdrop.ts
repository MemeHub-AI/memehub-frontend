import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'
import { nanoid } from 'nanoid'

import { airdropApi } from '@/api/airdrop'
import { useChainInfo } from '@/hooks/use-chain-info'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { MarketType } from '@/api/token/types'
import { addPrefix0x } from '@/utils/contract'
import { useTradeSearchParams } from '../use-search-params'
import { useAirdropStore } from '@/stores/use-airdrop'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { bottomLeft } from '@/config/toast'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { addrMap } from '@/contract/address'
import { DeviceWidth } from '@/hooks/use-responsive'
import { distributorAbiMap } from '@/contract/abi/distributor'

export const useAirdrop = (
  id: number = 0,
  type_list: string,
  onFinlly?: () => void
) => {
  const { t } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainId } = useChainInfo()
  const uniqueKey = useMemo(nanoid, [])
  const { setIsCalimingAirdrop } = useAirdropStore()
  const [isClaim, setIsCalim] = useState(false)
  const [isBurning, setBurning] = useState(false)
  const { checkForChain, checkForConnect } = useCheckAccount()
  const { playFire } = useAudioPlayer()

  const { distributor } = addrMap[chainId] ?? {}
  const toastConfig =
    window.innerWidth > DeviceWidth.Mobile ? bottomLeft : undefined

  // Query airdrop details.
  const { data: { data } = {}, refetch } = useQuery({
    // enabled: !!chainName && !!type_list && !!tokenAddr,
    enabled: false,
    queryKey: [airdropApi.getProof.name + uniqueKey, type_list, tokenAddr],
    queryFn: () => {
      if (type_list == 'undefined') return Promise.reject()
      return airdropApi.getProof({
        chain: chainName,
        type_list,
        token_address: tokenAddr,
      })
    },
  })

  const { data: isBurn, refetch: refetchIsBurn } = useReadContract({
    abi: distributorAbiMap['0.1.0'], // TODO: match version
    address: distributor,
    functionName: 'isBurn',
    args: [BigInt(id)],
    chainId,
    query: {
      refetchInterval: 5_000,
    },
  })

  const {
    data: hash,
    isPending: isSubmittingClaim,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () =>
        toast.loading(isClaim ? t('claiming') : t('burning'), toastConfig),
      onSettled: (_, __, ___, id) => {
        toast.dismiss(id)
        setBurning(false)
      },
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        setBurning(false)
      },
      onSuccess: () => {
        playFire()
        setBurning(false)
      },
    },
  })

  const { isFetching: isWaitingClaim } = useWaitForTx({
    hash,
    onLoading: () => {
      toast.loading(t('tx.waiting'), toastConfig)
    },
    onError: () =>
      toast.error(
        isClaim ? t('airdrop.claim.failed') : t('airdrop.burn.failed'),
        toastConfig
      ),
    onSuccess: () =>
      toast.success(
        isClaim ? t('airdrop.claim.success') : t('airdrop.burn.success'),
        toastConfig
      ),
    onFillay: () => {
      setBurning(false)
      toast.dismiss()
      refetchIsBurn()
      reset()
      refetch()
      onFinlly?.()
    },
  })
  const isClaiming = isSubmittingClaim || isWaitingClaim || isBurning

  const claim = async () => {
    if (!checkForConnect()) return

    const isValidChain = await checkForChain(chainId)
    if (!isValidChain) return
    if (!distributor) {
      CONTRACT_ERR.configNotFound()
      return
    }

    const { kol_proof = [], community_proof = [] } = data ?? {}
    const isKol = type_list.includes(MarketType.Kol.toString())
    const isCmnt = type_list.includes(MarketType.Community.toString())

    if (isKol && isEmpty(kol_proof)) {
      CONTRACT_ERR.proofNotFound()
      return
    }
    if (isCmnt && isEmpty(community_proof)) {
      CONTRACT_ERR.proofNotFound()
      return
    }

    setIsCalim(true)
    // TODO: should simulate first.
    writeContract({
      abi: distributorAbiMap['0.1.0'],
      address: distributor,
      functionName: 'claim',
      chainId,
      args: [BigInt(id), addPrefix0x(kol_proof), addPrefix0x(community_proof)],
    })
  }

  const burn = async () => {
    if (!checkForConnect()) return

    const isValidChain = await checkForChain(chainId)
    if (!isValidChain || !distributor) return

    setBurning(true)
    // TODO: should simulate first.
    writeContract({
      abi: distributorAbiMap['0.1.0'],
      address: distributor,
      functionName: 'burnToken',
      chainId,
      args: [BigInt(id)],
    })
  }

  useEffect(() => {
    setIsCalimingAirdrop(isClaiming)
  }, [isClaiming])

  return {
    isSubmittingClaim,
    isClaiming,
    isBurn,
    isBurning,
    claim,
    burn,
    resetClaim: reset,
  }
}
