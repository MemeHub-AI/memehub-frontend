import { toast } from 'sonner'
import { t } from 'i18next'

import { isUserReject } from '@/utils/contract'

export const CONTRACT_ERR = {
  // Contract execute error.
  exec: (err: unknown, showToast = true) => {
    const e = err as { message?: string }

    if (!e.message) return
    if (isUserReject(e?.message)) return
    if (showToast) toast.error(e?.message)

    console.error(e?.message)
  },

  // deploy related.
  unsupportChain: () => toast.error(t('deploy.unsupport.chain')),
  retryCreate: () => toast.error(t('cannot-retry')),
  marketParams: () => toast.error(t('deploy.invalid.merkle-root')),

  // trade related.
  tradeFailed: () => toast.error(t('trade.failed')),
  tokenInvalid: () => toast.error(t('trade.token.invalid')),
  amountInvlid: () => toast.error(t('trade.amount.invalid')),
  balanceInvalid: () => toast.error(t('trade.balance.invalid')),
  approve: () => toast.error(t('approve.error')),

  configNotFound: () => toast.error(t('deploy.config.empty')),
  proofNotFound: () => toast.error(t('deploy.proof.empty')),
}
