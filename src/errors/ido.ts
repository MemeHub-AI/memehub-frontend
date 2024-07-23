import { reportException } from './index'

import { isUserReject } from '@/utils/contract'

export const IDO_ERR = {
  message: (msg: string) => {
    const lower = msg.toLowerCase()

    reportException(msg)
    if (isUserReject(lower)) return
    // more...
  },
}
