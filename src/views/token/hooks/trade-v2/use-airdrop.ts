import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'

import { airdropApi } from '@/api/airdrop'
import { useChainInfo } from '@/hooks/use-chain-info'
import { getDistributorConfig } from '@/contract/v2/config/distributor'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { MarketType } from '@/api/token/types'
import { addPrefix0x } from '@/utils/contract'

export const useAirdrop = () => {
  const { t } = useTranslation()
  const { chainName, chainId } = useChainInfo()
  const { query } = useRouter()
  const { address } = useAccount()
  const distributionId = (query.id ?? '') as string
  const type_list = (query.type_list ?? '') as string
  const token_address = (query.address ?? '') as string
  const config = getDistributorConfig(chainId)

  const { data: { data } = {} } = useQuery({
    enabled: !!chainName && !!token_address,
    queryKey: [airdropApi.getProof.name],
    queryFn: () => {
      return airdropApi.getProof({
        chain: chainName,
        type_list,
        token_address,
      })
    },
  })

  const { data: isClaimed } = useReadContract({
    ...config!,
    functionName: 'isClaimed',
    args: [BigInt(distributionId!), address!],
    query: { enabled: !!config && !!distributionId && !!address },
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
  const { isFetching: isClaiming } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: () => toast.error(t('airdrop.claim.failed')),
    onSuccess: () => toast.success(t('airdrop.claim.success')),
    onFillay: () => toast.dismiss(),
  })

  const claim = () => {
    if (!config) {
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
      ...config!,
      functionName: 'claim',
      args: [
        BigInt(distributionId),
        isKol ? addPrefix0x(kol_proof) : [],
        isCmnt ? addPrefix0x(community_proof) : [],
      ],
    })
  }

  return {
    isSubmittingClaim,
    isClaiming,
    canClaim: !!distributionId && !!type_list && !isClaimed,
    claim,
    resetClaim,
  }
}
