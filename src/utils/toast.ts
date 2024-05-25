import { toast } from 'sonner'

import { isUserReject } from './contract'

export const customToast = {
  errorContract: (err: string | unknown) => {
    const e = String(err)

    if (isUserReject(e)) return
    toast.error(e)
  },
}
