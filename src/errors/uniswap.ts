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
      toast.error(t('uniswap.err.insufficient-amount'))
      return
    }

    if (isUserReject(msg)) return

    toast.error(msg)
    console.error(msg)
  },
}
