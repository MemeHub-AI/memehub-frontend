import { t } from 'i18next'
import { toast } from 'sonner'

import { isUserReject } from '@/utils/contract'

const ERR = {
  insufficientAmount: 'INSUFFICIENT_OUTPUT_AMOUNT'.toLowerCase(),
}

export const UNISWAP_ERR = {
  message: (msg: string) => {
    const lower = msg.toLowerCase()

    if (lower.includes(ERR.insufficientAmount)) {
      toast.error(t('uniswapv2.err.insufficient-amount'))
      return
    }
    if (isUserReject(lower)) return

    toast.error(msg)
    console.error(msg)
  },

  reserveNotFound: () => toast.error(t('uniswapv2.err.reserve-not-found')),
  poolAddrNotFound: () => toast.error(t('uniswapv2.err.pool-addr')),

  amonutInvalid: () => toast.error(t('uniswapv2.err.amount')),
}
