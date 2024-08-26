import { captureException } from '@sentry/nextjs'

import { dotenv } from '@/utils/env'

export const reportException = <T = unknown>(
  e: T,
  scope = 'ReportException'
) => {
  if (dotenv.isDev) {
    console.error(`[${scope}]: ${(e as Error)?.message || e}`)
    return
  }

  captureException(e)
}
