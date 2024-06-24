import { toast } from 'sonner'
import { t } from 'i18next'

import { isUserReject } from '@/utils/contract'

export const CONTRACT_ERR = {
  // Execute contract error.
  exec: (err: unknown, showToast = true) => {
    const e = err as { message?: string }

    if (!e.message) return
    if (isUserReject(e?.message)) return
    if (showToast) toast.error(e?.message)

    console.error(e?.message)
  },

  // Not found.
  configNotFound: () => toast.error(t('deploy.config.empty')),
  proofNotFound: () => toast.error(t('deploy.proof.empty')),
  marketParamsNotFound: () => toast.error(t('deploy.invalid.merkle-root')),
  versionNotFound: () => toast.error(t('notfound.version')),

  // Failed.
  retryCreateFailed: () => toast.error(t('cannot-retry')),
  tradeFailed: () => toast.error(t('trade.failed')),
  approveFailed: () => toast.error(t('approve.error')),
  claimFailed: () => toast.error(t('claim.failed')),

  // Invalid.
  tokenInvalid: () => toast.error(t('trade.token.invalid')),
  amountInvlid: () => toast.error(t('trade.amount.invalid')),
  balanceInvalid: () => toast.error(t('trade.balance.invalid')),
}
