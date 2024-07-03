import { toast } from 'sonner'
import { t } from 'i18next'

import { isUserReject } from '@/utils/contract'

const ERR = {
  estimateGas: 'gap tip',
  sell: 'MEMEHUB_InvalidSell'.toLowerCase(),
  burn: 'MEMEHUB_AlreadyBurn'.toLowerCase(),
}

export const CONTRACT_ERR = {
  // Execute contract error.
  exec: (err: unknown, showToast = true) => {
    const e = err as { message?: string }
    if (!e?.message) return

    const msg = (e.message ?? '').toLowerCase()

    // Cannot estimate gas.
    if (msg.includes(ERR.estimateGas)) {
      toast.error(t('contract.err.gas-estimate'))
      return
    }

    // Cannot to sell.
    if (msg.includes(ERR.sell)) {
      toast.error(t('contract.err.sell'))
      return
    }

    // Already burned.
    if (msg.includes(ERR.burn)) {
      toast.error(t('contract.err.burn'))
      return
    }

    // User reject.
    if (isUserReject(msg)) return

    // Toast all other error.
    if (showToast) toast.error(msg)
    console.error(msg)
  },

  // Uniswap trade error.
  uniswap: (msg: string) => {
    if (isUserReject(msg)) return

    toast.error(msg)
    console.error(msg)
  },

  // Not found error.
  configNotFound: () => toast.error(t('contract.err.config-not-found')),
  proofNotFound: () => toast.error(t('contract.err.proof-not-found')),
  marketParamsNotFound: () => toast.error(t('contract.err.market-not-found')),
  versionNotFound: () => toast.error(t('contract.err.version-not-found')),

  // Failed error.
  retryCreateFailed: () => toast.error(t('contract.err.try-create')),
  tradeFailed: () => toast.error(t('contract.err.trade')),
  approveFailed: () => toast.error(t('contract.err.approve')),
  claimFailed: () => toast.error(t('contract.err.claim')),
  chainChangeFailed: () => toast.error(t('contract.err.chain-failed')),

  // Invalid error.
  tokenInvalid: () => toast.error(t('contract.err.token-addr')),
  amountInvlid: () => toast.error(t('contract.err.amount')),
  balanceInvalid: () => toast.error(t('contract.err.balance')),
}
