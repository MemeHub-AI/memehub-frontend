import { useTranslation } from 'react-i18next'
import { useAccount, useWriteContract } from 'wagmi'
import { Address, erc20Abi, formatEther } from 'viem'
import { readContract } from '@wagmi/core'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'

import { SupportedChainId, wagmiConfig } from '@/config/wagmi'
import { useChainInfo } from './use-chain-info'

const APPROVE_MAX_VALUE = BigInt(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
)

export const useApprove = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainId } = useChainInfo()

  const {
    isPending: isApproving,
    writeContractAsync,
    reset: resetApprove,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('approving')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: () => toast.error(t('approve.error')),
      onSuccess: () => toast.success(t('approve.success')),
    },
  })

  const approvalForAll = async (token: Address, spender: Address) => {
    try {
      return await writeContractAsync({
        abi: erc20Abi,
        address: token,
        chainId,
        functionName: 'approve',
        args: [spender, APPROVE_MAX_VALUE],
      })
    } catch (error) {
      return false
    } finally {
      resetApprove()
    }
  }

  // Check a user's approval for a spender whether greater than amount.
  const checkForApproval = async (
    token: Address,
    spender: Address,
    amount: string
  ) => {
    try {
      if (!address) return false
      const approvedValue = await readContract(wagmiConfig, {
        abi: erc20Abi,
        address: token,
        functionName: 'allowance',
        chainId: chainId as SupportedChainId,
        args: [address, spender],
      })
      const shouldApprove = BigNumber(formatEther(approvedValue)).lt(amount)

      if (shouldApprove) {
        return await approvalForAll(token, spender)
      }
      return true
    } catch (error) {
      console.error('approve error', error)
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
