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
import { useUniswapV2Amount } from './use-uniswapv2-info'
import { reserveAddr } from '@/contract/address'
import { uniswapV2Addr } from '@/contract/uniswapv2/address'
import { CONTRACT_ERR } from '@/errors/contract'

export const useUniswapV2 = (
  tokenAddr: Address | undefined | null,
  poolAddr: Address | undefined | null,
  chainId: number
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { isApproving, approvalForAll } = useApprove()
  const { getAmountForBuy, getAmountForSell } = useUniswapV2Amount(poolAddr)

  const reserveToken = reserveAddr[chainId]
  const uniswapV2Address = uniswapV2Addr[chainId]
  const uniswapV2Config = {
    abi: uniswapV2RouterAbi,
    address: uniswapV2Address,
    chainId,
  }

  const {
    data: uniswapV2Hash,
    isPending: isSubmitting,
    writeContract,
    reset: uniswapV2Reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        UNISWAP_ERR.message(message)
        uniswapV2Reset()
      },
    },
  })

  const checkForTrade = (amount: string, amountInOut: string) => {
    if (isEmpty(amount)) {
      CONTRACT_ERR.amountInvlid()
      return false
    }
    if (!tokenAddr || !isAddress(tokenAddr)) {
      CONTRACT_ERR.tokenInvalid()
      return false
    }
    if (!reserveToken) {
      UNISWAP_ERR.reserveNotFound()
      return false
    }
    if (BigNumber(amountInOut).isZero()) {
      UNISWAP_ERR.amonutInvalid()
      return false
    }

    return true
  }

  const uniswapV2Buy = async (
    amount: string,
    slippage: string,
    withTax = false
  ) => {
    const tokenAmount = formatEther(await getAmountForBuy(amount))
    if (!checkForTrade(amount, tokenAmount)) return

    // TODO: should simulate first.
    writeContract({
      ...uniswapV2Config,
      functionName: withTax
        ? 'swapExactETHForTokensSupportingFeeOnTransferTokens'
        : 'swapExactETHForTokens',
      chainId,
      args: [
        subSlippage(tokenAmount, slippage),
        [reserveToken, tokenAddr!],
        address!,
        await getDeadline(),
      ],
      value: parseEther(amount),
    })
  }

  const uniswapV2Sell = async (
    amount: string,
    slippage: string,
    withTax = false
  ) => {
    const reserveAmount = formatEther(await getAmountForSell(amount))
    if (!checkForTrade(amount, reserveAmount)) return

    const isApproved = await approvalForAll(
      tokenAddr!,
      uniswapV2Address,
      amount
    )
    if (!isApproved) return

    // TODO: should simulate first.
    writeContract({
      ...uniswapV2Config,
      functionName: withTax
        ? 'swapExactTokensForETHSupportingFeeOnTransferTokens'
        : 'swapExactTokensForETH',
      chainId,
      args: [
        parseEther(amount),
        subSlippage(reserveAmount, slippage),
        [tokenAddr!, reserveToken],
        address!,
        await getDeadline(),
      ],
    })
  }

  return {
    uniswapV2Hash,
    isUniswapV2Trading: isSubmitting || isApproving,
    uniswapV2Buy,
    uniswapV2Sell,
    uniswapV2Reset,
  }
}
