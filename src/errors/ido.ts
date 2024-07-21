import { isUserReject } from '@/utils/contract'

export const IDO_ERR = {
  message: (msg: string) => {
    const lower = msg.toLowerCase()

    console.error(msg)
    if (isUserReject(lower)) return
  },
}
