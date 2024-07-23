import { captureException } from '@sentry/nextjs'

import { dotenv } from '@/utils/env'

export const reportException = <T = unknown>(e: T) => {
  if (dotenv.isDev) {
    console.error((e as Error)?.message || e)
    return
  }

  captureException(e)
}
