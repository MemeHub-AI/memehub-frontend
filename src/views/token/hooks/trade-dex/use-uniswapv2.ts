import { useAccount, useWriteContract } from 'wagmi'
import { formatEther, isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { useApprove } from '@/hooks/use-approve'
import { UNISWAP_ERR } from '@/errors/uniswap'
import { uniswapV2RouterAbi } from '@/contract/uniswapv2/abi/router'
import { getDeadline, subSlippage } from '@/utils/contract'
import { useUniswapV2Info } from './use-uniswapv2-info'
import { reserveAddr } from '@/contract/address'
import { uniswapV2Addr } from '@/contract/uniswapv2/address'

export const useUniswapV2 = (
  chainId: number,
  poolAddr: Address | undefined | null,
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { isApproving, approvalForAll } = useApprove()
  const { getAmountOut } = useUniswapV2Info(poolAddr)
  const reserveToken = reserveAddr[chainId]
  const uniswapV2Address = uniswapV2Addr[chainId]

  const {
    data: hash,
    isPending: isSubmitting,
    writeContract,
    reset: uniswapV2Reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => UNISWAP_ERR.message(message),
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

  const uniswapV2Buy = async (
    token: Address,
    amount: string,
    slippage: string,
  ) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    const tokenAmount = formatEther(await getAmountOut(amount))
    if (BigNumber(tokenAmount).isZero()) {
      UNISWAP_ERR.amonutInvalid()
      return
    }

    console.log('uniswap buy', {
      amount,
      token,
      address,
      chainId,
      slippaged: formatEther(subSlippage(tokenAmount, slippage)),
    })
    writeContract({
      abi: uniswapV2RouterAbi,
      address: uniswapV2Address,
      chainId,
      functionName: 'swapExactETHForTokens',
      args: [
        subSlippage(tokenAmount, slippage),
        [reserveToken, token],
        address!,
        await getDeadline(),
      ],
      value: parseEther(amount),
    })
  }

  const uniswapV2Sell = async (
    token: Address,
    amount: string,
    slippage: string,
  ) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    const isApproved = await approvalForAll(token, uniswapV2Address, amount)
    if (!isApproved) return

    const reserveAmount = formatEther(await getAmountOut(amount, true))
    if (BigNumber(reserveAmount).isZero()) {
      UNISWAP_ERR.amonutInvalid()
      return
    }

    console.log('uniswap sell', {
      amount,
      token,
      address,
      chainId,
      reserveAmount,
      slippaged: formatEther(subSlippage(reserveAmount, slippage)),
    })
    writeContract({
      abi: uniswapV2RouterAbi,
      address: uniswapV2Address,
      chainId,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        subSlippage(reserveAmount, slippage),
        [token, reserveToken],
        address!,
        await getDeadline(),
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
