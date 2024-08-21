import { useWriteContract } from 'wagmi'
import { toast } from 'sonner'

import { idoAirdropAbi } from '@/contract/abi/ido/airdrop'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { addrMap } from '@/contract/address'
import { useTranslation } from 'react-i18next'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { IDO_ERR } from '@/errors/ido'

export const useIdoAirdropClaim = (chainId: number, onSuccess?: () => void) => {
  const { t } = useTranslation()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { idoAirdrop } = addrMap[chainId] ?? {}

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
        IDO_ERR.airdrop(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.confirming')),
    onError: ({ message }) => IDO_ERR.message(message),
    onSuccess: () => {
      onSuccess?.()
      toast.success(t('ido.airdrop.claim-success'))
    },
    onFinally: () => {
      reset()
      toast.dismiss()
    },
  })

  const checkForClaim = async () => {
    if (!checkForConnect()) return false
    if (!(await checkForChain(chainId))) return false
    if (!idoAirdrop) return false

    return true
  }

  const claim = (isKol: boolean) => {
    if (!checkForClaim()) return

    // TODO: should simulate first.
    writeContract({
      abi: idoAirdropAbi,
      address: idoAirdrop!,
      chainId,
      functionName: isKol ? 'kolClaim' : 'communityClaim',
    })
  }

  return {
    isClaming: isPending || isLoading,
    claim,
  }
}
