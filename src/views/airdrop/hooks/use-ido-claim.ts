import { useWriteContract } from 'wagmi'
import { toast } from 'sonner'

import { idoAirdropAbi } from '@/contract/ido/abi/airdrop'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { v3Addr } from '@/contract/v3/address'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTranslation } from 'react-i18next'
import { idoChain } from '@/config/ido'
import { useCheckAccount } from '@/hooks/use-check-chain'

export const useIdoAirdropClaim = (onSuccess?: () => void) => {
  const { t } = useTranslation()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { idoAirdrop } = v3Addr[idoChain.id] ?? {}

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('tx.submitting')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.confirmation')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => {
      onSuccess?.()
      toast.success(t('ido.airdrop.claim-success'))
    },
    onFillay: () => {
      reset()
      toast.dismiss()
    },
  })

  const checkForClaim = async () => {
    if (!(await checkForConnect())) return false
    if (!(await checkForChain(idoChain.id))) return false
    if (!idoAirdrop) return false

    return true
  }

  const claim = (isKol: boolean) => {
    if (!checkForClaim()) return

    writeContract({
      abi: idoAirdropAbi,
      address: idoAirdrop!,
      functionName: isKol ? 'kolClaim' : 'communityClaim',
      chainId: idoChain.id,
    })
  }

  return {
    isClaming: isPending || isLoading,
    claim,
  }
}
