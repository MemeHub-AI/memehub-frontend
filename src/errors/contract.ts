import { createElement } from 'react'
import { toast } from 'sonner'
import { t } from 'i18next'
import { lowerCase } from 'lodash'
import { captureException } from '@sentry/nextjs'

import { isUserReject } from '@/utils/contract'
import { SlippageError } from '@/components/toast/slippage-error'
import { bottomLeft } from '@/config/toast'
import { DeviceWidth } from '@/hooks/use-responsive'
import { dotenv } from '@/utils/env'

const ERR = {
  estimateGas: 'gap tip',
  invalidSell: lowerCase('MEMEHUB_InvalidSell'),
  isBurned: lowerCase('MEMEHUB_AlreadyBurn'),
  transactionExecutionError: lowerCase('TransactionExecutionError'),
}

export const CONTRACT_ERR = {
  // Execute contract error.
  exec: (err: unknown, showToast = true) => {
    const e = err as { message?: string }
    if (!e?.message) return

    const msg = (e.message ?? '').toLowerCase()

    if (dotenv.isProd) captureException(e.message)

    // Cannot estimate gas.
    if (msg.includes(ERR.estimateGas)) {
      toast.error(t('contract.err.gas-estimate'))
      return
    }

    if (msg.includes(ERR.transactionExecutionError)) {
      toast.message(
        createElement(SlippageError),
        window.innerWidth > DeviceWidth.Mobile ? bottomLeft : undefined,
      )
      return
    }

    // Cannot to sell.
    if (msg.includes(ERR.invalidSell)) {
      toast.error(t('contract.err.sell'))
      return
    }

    // Already burned.
    if (msg.includes(ERR.isBurned)) {
      toast.error(t('contract.err.burn'))
      return
    }

    // User reject.
    if (isUserReject(msg)) return

    // Toast all other error.
    if (showToast) toast.error(t('contract.err.exec'))
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
  balanceInsufficient: () =>
    toast.error(t('contract.err.balance-insufficient')),
}
