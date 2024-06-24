import { useQuery } from '@tanstack/react-query'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'

import { airdropApi } from '@/api/airdrop'
import { useChainInfo } from '@/hooks/use-chain-info'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { MarketType } from '@/api/token/types'
import { addPrefix0x } from '@/utils/contract'
import { useTradeSearchParams } from '../use-search-params'
import { getV3Config } from '@/contract/v3/config'

export const useAirdrop = (id: number, type_list: string) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { chainId } = useChainInfo()
  const { distributorConfig } = getV3Config(chainId)

  const { data: { data } = {} } = useQuery({
    enabled: !!chainName && !!type_list && !!tokenAddr,
    queryKey: [airdropApi.getProof.name],
    queryFn: () => {
      return airdropApi.getProof({
        chain: chainName,
        type_list,
        token_address: tokenAddr,
      })
    },
  })

  const { data: claimData } = useReadContract({
    ...distributorConfig!,
    functionName: 'distributions',
    args: [BigInt(id!)],
    query: { enabled: !!distributorConfig && !!id },
  })
  const canClaim = !!id && !!type_list && !!claimData

  console.log('is claimd', id, claimData)

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
  const { isFetching: isClaiming } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: () => toast.error(t('airdrop.claim.failed')),
    onSuccess: () => toast.success(t('airdrop.claim.success')),
    onFillay: () => toast.dismiss(),
  })

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

    console.log('proof', { kol_proof, community_proof })

    writeContract({
      ...distributorConfig,
      functionName: 'claim',
      args: [
        BigInt(id),
        isKol ? addPrefix0x(kol_proof) : [],
        isCmnt ? addPrefix0x(community_proof) : [],
      ],
    })
  }

  return {
    isSubmittingClaim,
    isClaiming,
    canClaim,
    claim,
    resetClaim,
  }
}
