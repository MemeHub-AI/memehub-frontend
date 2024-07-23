import { reportException } from './index'

import { isUserReject } from '@/utils/contract'
import { dotenv } from '@/utils/env'

export const IDO_ERR = {
  message: (msg: string) => {
    const lower = msg.toLowerCase()

    console.error(msg)
    reportException
    if (isUserReject(lower)) return
  },
}
