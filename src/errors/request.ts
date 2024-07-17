import { toast } from 'sonner'

import { ApiResponse } from '@/api/types'
import { loggerError } from '@/utils/log'

export const REQUEST_ERR = {
  responseErr: async (response: Response) => {
    try {
      const { message } = (await response.json()) as ApiResponse
      loggerError(message)
      // toast.error(message)
    } catch {
      // if (response.status >= 500) {
      //   toast.error('Server error, please try again.')
      //   return
      // }
      // if (response.status >= 400 && response.status <= 499) {
      //   toast.error('Request error, please try again.')
      //   return
      // }
      loggerError(response.status)
    }
  },
  error: (e: Error) => {
    const m = e.message.toLowerCase()
    if (m.includes('network')) {
      toast.error('Network error, please try again.')
      return
    }

    if (m.includes('aborted')) {
      return
    }

    loggerError(m)
  },
}
