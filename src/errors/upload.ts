import { toast } from 'sonner'
import { t } from 'i18next'

import { reportException } from '.'

export const UPLOAD_ERR = {
  message(msg: string) {
    reportException(msg)
    toast.error(`${t('upload.failed')}: ${msg}`)
  },
}
