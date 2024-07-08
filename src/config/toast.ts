import { ExternalToast } from 'sonner'

export const buttonLeft = {
  position:
    typeof window !== 'undefined' && window.innerWidth < 600
      ? 'top-center'
      : 'bottom-left',
} as ExternalToast
