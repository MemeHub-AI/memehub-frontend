import { useAccount, useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { useApprove } from '@/hooks/use-approve'
import { commonAddr } from '@/contract/address'
import { CONTRACT_ERR } from '@/errors/contract'
import { uniswapV2Config } from '@/contract/abi/uniswap-v2'

export const useUniswapV2 = () => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const { isApproving, approvalForAll } = useApprove()

  const { reserveToken } = commonAddr[chainId as keyof typeof commonAddr] || {}

  const {
    data: hash,
    isPending: isSubmitting,
    writeContract,
    reset: uniswapV2Reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => CONTRACT_ERR.exec(e),
    },
  })

  const checkForTrade = (amount: string, token: Address) => {
    if (!address || isEmpty(address)) {
      toast.error(t('trade.account.invalid'))
      return false
    }
    if (isEmpty(amount)) {
      toast.error(t('trade.amount.invalid'))
      return false
    }
    if (!isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return false
    }
    if (!reserveToken) {
      return toast.error(t('chain.empty'))
    }
    return true
  }

  const uniswapV2Buy = (amount: string, token: Address) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    console.log('uniswap buy', amount, token)
    writeContract({
      ...uniswapV2Config,
      functionName: 'swapExactETHForTokens',
      args: [BigInt(0), [reserveToken, token], address!, BigInt(Date.now())],
      value: parseEther(amount),
    })
  }

  const uniswapV2Sell = async (amount: string, token: Address) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    const isApproved = await approvalForAll(token, reserveToken, amount)
    if (!isApproved) return

    console.log('uniswap sell', amount, token)
    writeContract({
      ...uniswapV2Config,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        BigInt(0),
        [token, reserveToken],
        address!,
        BigInt(Date.now()),
      ],
    })
  }

  return {
    uniswapV2Hash: hash,
    isUniswapV2Trading: isSubmitting || isApproving,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  }
}