import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

import { useApprove } from '@/hooks/use-approve'
import { commonAddr } from '@/contract/address'
import { logger } from '@/utils/log'
import { useChainInfo } from '@/hooks/use-chain-info'
import { UNISWAP_ERR } from '@/errors/uniswap'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { subSlippage } from '@/utils/contract'

export const useUniswapV2 = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainId } = useChainInfo()
  const { isApproving, approvalForAll } = useApprove()

  const { reserveToken, router } =
    commonAddr[chainId as keyof typeof commonAddr] || {}

  const {
    data: hash,
    isPending: isSubmitting,
    writeContract,
    reset: uniswapV2Reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: (e) => UNISWAP_ERR.exec(e.message),
    },
  })

  const checkForTrade = (amount: string, token: Address) => {
    if (!address || isEmpty(address)) {
      toast.error(t('trade.account.invalid'))
      return false
    }
    if (isEmpty(amount)) {
      toast.error(t('contract.err.amount'))
      return false
    }
    if (!isAddress(token)) {
      toast.error(t('contract.err.token-addr'))
      return false
    }
    if (!reserveToken) {
      return toast.error(t('chain.empty'))
    }
    return true
  }

  const uniswapV2Buy = (amount: string, token: Address, slippage: string) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    logger('uniswap buy', {
      amount,
      token,
      address,
      chainId,
      router,
      reserveToken,
      slippaged: formatEther(subSlippage(amount, slippage)),
    })
    writeContract({
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'swapExactETHForTokens',
      args: [
        subSlippage(amount, slippage),
        [reserveToken, token],
        address!,
        BigInt(dayjs().unix() + 60),
      ],
      value: parseEther(amount),
    })
  }

  const uniswapV2Sell = async (
    amount: string,
    token: Address,
    slippage: string
  ) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    const isApproved = await approvalForAll(token, router, amount)
    if (!isApproved) return

    logger('uniswap sell', {
      amount,
      token,
      address,
      chainId,
      router,
      reserveToken,
      slippaged: formatEther(subSlippage(amount, slippage)),
    })
    writeContract({
      abi: uniswapV2RouterAbi,
      address: router,
      chainId,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        subSlippage(amount, slippage),
        [token, reserveToken],
        address!,
        BigInt(dayjs().unix() + 60),
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
