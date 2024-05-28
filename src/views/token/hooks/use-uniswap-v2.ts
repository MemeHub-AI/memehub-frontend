import { useAccount, useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { uniswapV2Abi } from '../../../contract/abi/uniswap-v2'
import { customToast } from '@/utils/toast'
import { uniswapV2Address } from '@/contract/address'
import { useDeployConfig } from '@/views/create/hooks/use-deploy-config'
import { useApprove } from '@/hooks/use-approve'

export const useUniswapV2 = () => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { routerAddress, nativeTokenAddress } = useDeployConfig()
  const { isApproving, checkForApproval } = useApprove()

  const {
    data: hash,
    isPending: isUniswapTrading,
    writeContract,
    reset: resetUniswapTrade,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        return toast.loading(t('trade.loading'), {
          action: { label: t('cancel'), onClick: () => resetUniswapTrade() },
        })
      },
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: customToast.errorContract,
      onSuccess: () => toast.success(t('submit.success')),
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

    console.log('uniswap buy', amount, token)
    writeContract({
      abi: uniswapV2Abi,
      address: uniswapV2Address,
      functionName: 'swapExactETHForTokens',
      args: [
        BigInt(0),
        [nativeTokenAddress.scroll, token],
        address!,
        BigInt(Date.now()),
      ],
      value: parseEther(amount),
    })
  }

  const uniswapSell = async (amount: string, token: Address) => {
    const isApproved = await checkForApproval(
      token,
      routerAddress.scroll,
      amount
    )
    if (!isApproved) return

    const isValid = checkForTrade(amount, token)
    if (!isValid) return

    console.log('uniswap sell', amount, token)
    writeContract({
      abi: uniswapV2Abi,
      address: uniswapV2Address,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        BigInt(0),
        [token, nativeTokenAddress.scroll],
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