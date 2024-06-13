import { useAccount, useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { v1UniswapV2Abi } from '../../../contract/v1/abi/uniswap-v2'
import { customToast } from '@/utils/toast'
import { v1Addr } from '@/contract/v1/address'
import { useApprove } from '@/hooks/use-approve'

export const useUniswapV2 = () => {
  const { t } = useTranslation()
  const { address, chainId } = useAccount()
  const { isApproving, checkForApproval } = useApprove()

  const nativeTokenAddr =
    v1Addr.reserveToken[chainId as keyof typeof v1Addr.reserveToken]

  const {
    data: hash,
    isPending: isUniswapTrading,
    writeContract,
    reset: resetUniswapTrade,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('trade.loading')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: customToast.errorContract,
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
    return true
  }

  const uniswapBuy = (amount: string, token: Address) => {
    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    if (!nativeTokenAddr) {
      return toast.error(t('chain.empty'))
    }

    console.log('uniswap buy', amount, token)
    writeContract({
      abi: v1UniswapV2Abi,
      address: v1Addr.uniswapV2,
      functionName: 'swapExactETHForTokens',
      args: [BigInt(0), [nativeTokenAddr, token], address!, BigInt(Date.now())],
      value: parseEther(amount),
    })
  }

  const uniswapSell = async (amount: string, token: Address) => {
    if (!nativeTokenAddr) {
      return toast.error(t('chain.empty'))
    }

    const isApproved = await checkForApproval(token, nativeTokenAddr, amount)
    if (!isApproved) return

    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    console.log('uniswap sell', amount, token)
    writeContract({
      abi: v1UniswapV2Abi,
      address: v1Addr.uniswapV2,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        BigInt(0),
        [token, nativeTokenAddr],
        address!,
        BigInt(Date.now()),
      ],
    })
  }

  return {
    uniswapHash: hash,
    isUniswapTrading: isUniswapTrading || isApproving,
    uniswapBuy,
    uniswapSell,
    resetUniswapTrade,
  }
}
