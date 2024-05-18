import { toast } from 'sonner'

export const toastNoReject = (err: string | unknown) => {
  const e = (err = String(err))
  if (e.toLowerCase().includes('user rejected')) return
  toast.error(e)
}
