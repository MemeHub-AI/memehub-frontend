import { useTranslation } from 'react-i18next'
import { useAccount, useWriteContract } from 'wagmi'
import { Address, erc20Abi, formatEther } from 'viem'
import { readContract } from 'wagmi/actions'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'

import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { CONTRACT_ERR } from '@/errors/contract'

const APPROVE_MAX_VALUE = BigInt(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
)

export const useApprove = (chainId: number) => {
  const { t } = useTranslation()
  const { address } = useAccount()

  const {
    isPending: isApproving,
    writeContractAsync,
    reset: resetApprove,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('approving')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: () => CONTRACT_ERR.approveFailed(),
      onSuccess: () => toast.success(t('approve.success')),
    },
  })

  const approvalForAll = async (
    token: Address,
    spender: Address,
    amount: string
  ) => {
    const isApproved = await checkForApproval(token, spender, amount)
    if (isApproved) return true

    try {
      await writeContractAsync({
        abi: erc20Abi,
        address: token,
        chainId,
        functionName: 'approve',
        args: [spender, APPROVE_MAX_VALUE],
      })
      return true
    } catch (e) {
      CONTRACT_ERR.message((e as Error).message)
      return false
    } finally {
      resetApprove()
    }
  }

  const checkForApproval = async (
    token: Address,
    spender: Address,
    amount: string
  ) => {
    try {
      if (!address) return false
      const value = await readContract(wagmiConfig, {
        abi: erc20Abi,
        address: token,
        functionName: 'allowance',
        chainId: chainId as ConfigChainId,
        args: [address, spender],
      })

      return BigNumber(formatEther(value)).gte(amount)
    } catch (e) {
      CONTRACT_ERR.message((e as Error).message)
      return false
    }
  }

  return {
    isApproving,
    checkForApproval,
    approvalForAll,
    resetApprove,
  }
}
