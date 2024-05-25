import { useAccount, useWriteContract } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { uniswapV2Contract } from './../../../contract/uniswap-v2'
import { customToast } from '@/utils/toast'

const ETH_ADDRESS = '0x5300000000000000000000000000000000000004'

const ETH_RECEIVER = '0x7970af446b850f7Db1229996fff7127795Dc7214'

export const useUniswapV2 = () => {
  const { t } = useTranslation()
  const { address } = useAccount()

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

  const uniswapBuy = (amount: string, token: Address) => {
    if (!address || isEmpty(address)) {
      toast.error(t('trade.account.invalid'))
      return
    }
    if (isEmpty(amount)) {
      toast.error(t('trade.amount.invalid'))
      return
    }
    if (!isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return
    }

    console.log('uniswap buy', amount, token)
    writeContract({
      ...uniswapV2Contract,
      functionName: 'swapExactETHForTokens',
      args: [BigInt(0), [ETH_ADDRESS, token], address!, BigInt(Date.now())],
      value: parseEther(amount),
    })
  }

  const uniswapSell = (amount: string, token: Address) => {
    if (isEmpty(amount)) {
      toast.error(t('trade.amount.invalid'))
      return
    }
    if (!isAddress(token)) {
      toast.error(t('trade.token.invalid'))
      return
    }

    console.log('uniswap sell', amount, token)
    writeContract({
      ...uniswapV2Contract,
      functionName: 'swapExactTokensForETH',
      args: [
        parseEther(amount),
        BigInt(0),
        [token, ETH_ADDRESS],
        ETH_RECEIVER,
        BigInt(Date.now()),
      ],
    })
  }

  return {
    uniswapHash: hash,
    isUniswapTrading,
    uniswapBuy,
    uniswapSell,
    resetUniswapTrade,
  }
}
