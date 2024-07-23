import { reportException } from './index'

import { isUserReject } from '@/utils/contract'

export const IDO_ERR = {
  message: (msg: string) => {
    const m = msg.toLowerCase()

    reportException(msg)
    if (isUserReject(m)) return
    // more...
  },
}
