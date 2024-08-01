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

export const useUniswapV2 = (
  chainId: number,
  poolAddr: Address | undefined | null
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

  const checkForTrade = (token: Address, amount: string) => {
    if (!address) {
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
      toast.error(t('chain.empty'))
      return false
    }
    return true
  }

  const uniswapV2Buy = async (
    token: Address,
    amount: string,
    slippage: string,
    withTax = false
  ) => {
    if (!checkForTrade(token, amount)) return

    const tokenAmount = formatEther(await getAmountForBuy(amount))
    if (BigNumber(tokenAmount).isZero()) {
      UNISWAP_ERR.amonutInvalid()
      return
    }

    // TODO: should simulate first.
    writeContract({
      ...uniswapV2Config,
      functionName: withTax
        ? 'swapExactETHForTokensSupportingFeeOnTransferTokens'
        : 'swapExactETHForTokens',
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
    withTax = false
  ) => {
    if (!checkForTrade(token, amount)) return

    const isApproved = await approvalForAll(token, uniswapV2Address, amount)
    if (!isApproved) return

    const reserveAmount = formatEther(await getAmountForSell(amount))
    if (BigNumber(reserveAmount).isZero()) {
      UNISWAP_ERR.amonutInvalid()
      return
    }

    // TODO: should simulate first.
    writeContract({
      ...uniswapV2Config,
      functionName: withTax
        ? 'swapExactTokensForETHSupportingFeeOnTransferTokens'
        : 'swapExactTokensForETH',
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
