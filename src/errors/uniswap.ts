import { t } from 'i18next'
import { toast } from 'sonner'

import { isUserReject } from '@/utils/contract'

const ERR = {
  insufficientAmount: 'INSUFFICIENT_OUTPUT_AMOUNT'.toLowerCase(),
}

export const UNISWAP_ERR = {
  exec: (msg: string) => {
    msg = msg.toLowerCase()

    if (msg.includes(ERR.insufficientAmount)) {
      toast.error(t('uniswapv2.err.insufficient-amount'))
      return
    }

    if (isUserReject(msg)) return

    toast.error(msg)
    console.error(msg)
  },

  reserveNotFound: () => toast.error(t('uniswapv2.err.reserve-not-found')),

  reserveAmonutInvalid: () => toast.error(t('uniswapv2.err.reserve-amount')),
}
