import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useChainId,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'
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
import { getV3Config } from '@/contract/v3/config'
import { useAirdropStore } from '@/stores/use-airdrop'

export const useAirdrop = (
  id: number,
  type_list: string,
  onFinlly?: () => void
) => {
  const { t } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainId } = useChainInfo()
  const clientChianId = useChainId()
  const { distributorConfig } = getV3Config(chainId)
  const uniqueKey = useMemo(nanoid, [])
  const { setIsCalimingAirdrop } = useAirdropStore()
  const { switchChain } = useSwitchChain()
  const [isClaim, setIsCalim] = useState(false)
  const [isBurning, setBurning] = useState(false)

  // Query airdrop details.
  const { data: { data } = {}, refetch } = useQuery({
    enabled: !!chainName && !!type_list && !!tokenAddr,
    queryKey: [airdropApi.getProof.name + uniqueKey, type_list, tokenAddr],
    queryFn: () => {
      return airdropApi.getProof({
        chain: chainName,
        type_list,
        token_address: tokenAddr,
      })
    },
  })

  const { data: isBurn } = useReadContract({
    ...distributorConfig!,
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
      onMutate: () => toast.loading(isClaim ? t('claiming') : t('burning')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })

  const { isFetching: isWaitingClaim } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: () =>
      toast.error(
        isClaim ? t('airdrop.claim.failed') : t('airdrop.burn.failed')
      ),
    onSuccess: () =>
      toast.success(
        isClaim ? t('airdrop.claim.success') : t('airdrop.burn.success')
      ),
    onFillay: () => {
      toast.dismiss()
      setBurning(false)
      reset()
      refetch()
      onFinlly?.()
    },
  })
  const isClaiming = isSubmittingClaim || isWaitingClaim || isBurning

  const claim = () => {
    if (!distributorConfig) {
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
    writeContract({
      ...distributorConfig,
      functionName: 'claim',
      args: [BigInt(id), addPrefix0x(kol_proof), addPrefix0x(community_proof)],
      chainId,
    })
  }

  const burn = () => {
    if (chainId !== clientChianId) {
      return switchChain({ chainId })
    }
    setBurning(true)
    writeContract({
      ...distributorConfig!,
      functionName: 'burnToken',
      args: [BigInt(id)],
      chainId,
    })
  }

  useEffect(() => {
    setIsCalimingAirdrop(isClaiming)
  }, [isClaiming])

  return {
    isSubmittingClaim,
    isClaiming,
    isBurn,
    claim,
    burn,
    resetClaim: reset,
  }
}
