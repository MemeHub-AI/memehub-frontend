import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CircleAlert } from 'lucide-react'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { isUserReject } from '@/utils/contract'
import { fmt } from '@/utils/fmt'
import { useCreateTokenContext } from '@/contexts/create-token'

export const CreateTokenStatusDialog = () => {
  const { t } = useTranslation()
  const {
    deployResult: {
      deployLogAddr,
      createTokenData,
      createTokenError,
      isSubmitting,
      isConfirming,
      isDeploySuccess,
      isCreatingToken,
      submitError,
      confirmError,
      resetDeploy,
      retryCreate,
    },
  } = useCreateTokenContext()

  const chainName = createTokenData?.chain?.name || ''
  const deployedAddr = createTokenData?.address || ''
  const explorerUrl = createTokenData?.chain?.explorer_tx || ''

  const withIcon = (children: ReactNode) => {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <CircleAlert size={18} />
        {children}
      </div>
    )
  }

  // Submiting, create start.
  if (isSubmitting) {
    return (
      <Dialog open={isSubmitting} contentProps={{ onCloseClick: resetDeploy }}>
        <DialogTitle>{t('deploy.submit.title')}</DialogTitle>
        <DialogDescription>{t('deploy.submit.description')}</DialogDescription>
      </Dialog>
    )
  }

  // Submit error.
  if (submitError) {
    // User rejected.
    if (isUserReject(submitError)) {
      resetDeploy()
      toast.error(t('user-rejected'))
      return
    }
    return (
      <AlertDialog
        open={!!submitError}
        title={withIcon(t('deploy.submit.error') + ':')}
        description={
          <span className="break-all line-clamp-3">{submitError?.message}</span>
        }
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
      />
    )
  }

  // Confirming, Submit success.
  if (isConfirming) {
    return (
      <Dialog
        open={isConfirming}
        contentProps={{
          onCloseClick: () => toast.info(t('deploy.confirm.close')),
        }}
      >
        <DialogTitle>{t('deploy.submit.success')}</DialogTitle>
        <DialogDescription>
          <span>{t('deploy.submit.success.desc')}</span>
        </DialogDescription>
      </Dialog>
    )
  }

  // Confirm error.
  if (confirmError) {
    return (
      <AlertDialog
        open={!!confirmError}
        title={withIcon(t('deploy.confirm.error') + ':')}
        description={
          <span className="break-all line-clamp-3">
            {confirmError?.message}
          </span>
        }
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
      />
    )
  }

  // Submit token info
  if (isCreatingToken) {
    return (
      <AlertDialog
        open={isCreatingToken}
        title={t('deploy.backend.submitting')}
        description={t('deploy.backend.submitting.desc')}
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
      />
    )
  }

  // Submit to backend error.
  if (createTokenError) {
    return (
      <AlertDialog
        open={!!createTokenError}
        title={withIcon(t('deploy.backend.error') + ':')}
        description={
          <span>
            <span className="break-all line-clamp-3">
              {t('deploy.backend.error.desc')}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={retryCreate}
              >
                {t('retry')}
              </span>
            </span>
          </span>
        }
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
      />
    )
  }

  // Successful!
  if (isDeploySuccess) {
    return (
      <AlertDialog
        open={isDeploySuccess}
        title={t('deploy.success')}
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
        description={
          <span className="flex flex-col gap-2 w-fit">
            <Link
              className="text-blue-600 hover:underline"
              href={Routes.Main}
              onClick={resetDeploy}
            >
              {t('deploy.success.view-list')}
            </Link>
            {chainName && (deployedAddr || deployLogAddr) && (
              <Link
                className="text-blue-600 hover:underline"
                href={fmt.toHref(
                  Routes.Main,
                  chainName,
                  deployedAddr || deployLogAddr || ''
                )}
                onClick={resetDeploy}
              >
                {t('deploy.success.view-details')}
              </Link>
            )}
            <Link
              className="text-blue-600 hover:underline"
              href={explorerUrl}
              target="_blank"
              onClick={resetDeploy}
            >
              {t('deploy.success.view-hash')}
            </Link>
          </span>
        }
      />
    )
  }

  // It shouldn't have come to this.
  return <></>
}

export default CreateTokenStatusDialog
