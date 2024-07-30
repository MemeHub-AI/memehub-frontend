import { toast } from 'sonner'

import { reportException } from '.'

export const REQUEST_ERR = {
  message: (e: unknown) => {
    const m = String((e as Error)?.message || e)

    reportException(e)
    if (m.includes('network')) {
      toast.error('Network error, please try again.')
      return
    }
  },
}
