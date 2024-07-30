import { toast } from 'sonner'
import { t } from 'i18next'

import { reportException } from './index'
import { isUserReject } from '@/utils/contract'

export const IDO_ERR = {
  message: (msg: string) => {
    const m = msg.toLowerCase()

    reportException(msg)
    if (isUserReject(m)) return
    // more...
  },
  airdrop(msg: string) {
    reportException(msg)
    if (isUserReject(msg)) return

    if (msg.includes(`Don't have enough`)) {
      toast.error(t('ido.airdrop.not-enough'))
      return
    }
  },
}
