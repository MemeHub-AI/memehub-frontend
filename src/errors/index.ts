import { isUserReject } from '@/utils/contract'
import { toast } from 'sonner'

export const ERR = {
  notFound: (value: string) => {
    return new Error(`${value} is not found.`)
  },
  contract: (err: unknown, showToast = true) => {
    const e = err as { message?: string }

    if (!e.message) return
    if (isUserReject(e?.message)) return
    if (showToast) toast.error(e?.message)

    console.error(e?.message)
  },
}
