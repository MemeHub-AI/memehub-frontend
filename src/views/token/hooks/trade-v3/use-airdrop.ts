import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWriteContract } from 'wagmi'
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
  onClaimed?: () => void
) => {
  const { t } = useTranslation()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainId } = useChainInfo()
  const { distributorConfig } = getV3Config(chainId)
  const uniqueKey = useMemo(nanoid, [])
  const { setIsCalimingAirdrop } = useAirdropStore()

  // Query airdrop details.
  const { data: { data } = {}, refetch } = useQuery({
    enabled: !!chainName && !!type_list && !!tokenAddr,
    queryKey: [airdropApi.getProof.name + uniqueKey],
    queryFn: () => {
      return airdropApi.getProof({
        chain: chainName,
        type_list,
        token_address: tokenAddr,
      })
    },
  })

  const {
    data: hash,
    isPending: isSubmittingClaim,
    writeContract,
    reset: resetClaim,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('claiming')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })
  const { isFetching: isWaitingClaim } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: () => toast.error(t('airdrop.claim.failed')),
    onSuccess: () => toast.success(t('airdrop.claim.success')),
    onFillay: () => {
      toast.dismiss()
      resetClaim()
      refetch()
      onClaimed?.()
    },
  })
  const isClaiming = isSubmittingClaim || isWaitingClaim

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

    writeContract({
      ...distributorConfig,
      functionName: 'claim',
      args: [BigInt(id), addPrefix0x(kol_proof), addPrefix0x(community_proof)],
      chainId,
    })
  }

  useEffect(() => {
    setIsCalimingAirdrop(isClaiming)
  }, [isClaiming])

  return {
    isSubmittingClaim,
    isClaiming,
    claim,
    resetClaim,
  }
}
