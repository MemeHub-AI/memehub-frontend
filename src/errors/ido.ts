import { captureException } from '@sentry/nextjs'

import { isUserReject } from '@/utils/contract'
import { dotenv } from '@/utils/env'

export const IDO_ERR = {
  message: (msg: string) => {
    const lower = msg.toLowerCase()

    console.error(msg)
    if (dotenv.isProd) captureException(msg)
    if (isUserReject(lower)) return
  },
}
