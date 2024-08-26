import { createElement } from 'react'
import { toast } from 'sonner'
import { t } from 'i18next'

import { isUserReject } from '@/utils/contract'
import { SlippageError } from '@/components/trade-toast/slippage-error'
import { bottomLeft } from '@/config/toast'
import { DeviceWidth } from '@/hooks/use-responsive'
import { reportException } from '.'
import { lowerIncludes } from '@/utils'

const errs = {
  txExecErr: 'TransactionExecutionError',
  gasTip: 'Gas Tip',
  gasInsufficient: 'Gas',
  invalidSell: 'MEMEHUB_InvalidSell',
  isBurned: 'MEMEHUB_AlreadyBurn',
}

export const CONTRACT_ERR = {
  // Execute contract error.
  message: (msg: string, showToast = true) => {
    if (isUserReject(msg)) return

    const errIncludes = lowerIncludes(msg)

    reportException(msg)

    if (errIncludes(errs.gasTip)) {
      toast.error(t('contract.err.gas-estimate'))
      return
    }
    if (errIncludes(errs.gasInsufficient)) {
      toast.error(t('gas-insufficient'))
      return
    }
    if (errIncludes(errs.txExecErr)) {
      toast.message(
        createElement(SlippageError),
        window.innerWidth > DeviceWidth.Mobile ? bottomLeft : undefined
      )
      return
    }
    if (errIncludes(errs.invalidSell)) {
      toast.error(t('contract.err.sell'))
      return
    }
    if (errIncludes(errs.isBurned)) {
      toast.error(t('contract.err.burn'))
      return
    }
    if (showToast) toast.error(t('contract.err.exec'))
  },

  userReject: () => toast.warning(t('user-rejected')),

  // Not found error.
  configNotFound: (msg = '') =>
    toast.error(`${t('contract.err.config-not-found')} ${msg}`),
  proofNotFound: () => toast.error(t('contract.err.proof-not-found')),
  marketParamsNotFound: () => toast.error(t('contract.err.market-not-found')),
  versionNotFound: () => toast.error(t('contract.err.version-not-found')),
  contractAddrNotFound: () =>
    toast.error(t('contract.err.contract-addr-not-found')),

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
