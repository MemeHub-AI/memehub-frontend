import { t } from 'i18next'
import { toast } from 'sonner'

import { isUserReject } from '@/utils/contract'
import { reportException } from '.'

const ERR = {
  insufficientAmount: 'INSUFFICIENT_OUTPUT_AMOUNT'.toLowerCase(),
}

export const UNISWAP_ERR = {
  message: (msg: string, showToast = true) => {
    const m = msg.toLowerCase()

    reportException(msg, 'UniswapV2')
    if (isUserReject(m)) return
    if (m.includes(ERR.insufficientAmount)) {
      toast.error(t('uniswapv2.err.insufficient-amount'))
      return
    }

    if (showToast) toast.error(t('occurred-error'))
  },

  reserveNotFound: () => toast.error(t('uniswapv2.err.reserve-not-found')),
  poolAddrNotFound: () => toast.error(t('uniswapv2.err.pool-addr')),

  amonutInvalid: () => toast.error(t('uniswapv2.err.amount')),
}
