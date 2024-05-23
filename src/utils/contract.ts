import { toast } from 'sonner'

// Fullname: toast contract error.
// Excludes user rejected error.
export const toastCE = (err: string | unknown) => {
  const e = String(err)
  if (e.toLowerCase().includes('user rejected')) return
  toast.error(e)
}

// Whether user rejected error.
export const isUserReject = (err: string | unknown) => {
  const e = String(err).toLowerCase()

  return e.includes('user rejected') || e.includes('user denied')
}
