import { toast } from 'sonner'

import { isUserReject } from '@/utils/contract'

export const CONTRACT_ERR = {
  exec: (err: unknown, showToast = true) => {
    const e = err as { message?: string }

    if (!e.message) return
    if (isUserReject(e?.message)) return
    if (showToast) toast.error(e?.message)

    console.error(e?.message)
  },
}
