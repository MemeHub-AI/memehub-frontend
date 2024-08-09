import { t } from 'i18next'
import { toast } from 'sonner'

export const deployErr = {
  createFailed: () => toast.error(t('create-token.err.failed')),
  networkNotFound: () => toast.error(t('create-token.err.network-not-found')),
}
