import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CircleAlert } from 'lucide-react'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'
import { useDeploy } from '../hooks/use-deploy'
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { isUserReject } from '@/utils/contract'
import { fmt } from '@/utils/fmt'

interface Props extends ReturnType<typeof useDeploy> {}

export const CreateTokenStatusDialog = (props: Props) => {
  const {
    createTokenData,
    createTokenError,
    deployHash = '',
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isCreatingToken,
    submitError,
    confirmError,
    resetDeploy,
    retryCreate,
  } = props
  const { t } = useTranslation()
  const { name: chainName = '', explorer_tx = '' } =
    createTokenData?.chain || {}
  const deployedAddr = createTokenData?.address || ''

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
          <p className="break-all line-clamp-3">{submitError?.message}</p>
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
          <p>{t('deploy.submit.success.desc')}</p>
          <p>
            {t('deploy.submit.success.view-hash')}:{' '}
            <Link
              href={fmt.toHref(explorer_tx, deployHash)}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              {t('view')}
            </Link>
          </p>
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
          <p className="break-all line-clamp-3">{confirmError?.message}</p>
        }
        onCancel={resetDeploy}
        onConfirm={resetDeploy}
      />
    )
  }

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
          <div>
            <p className="break-all line-clamp-3">
              {t('deploy.backend.error.desc')}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={retryCreate}
              >
                {t('retry')}
              </span>
            </p>
          </div>
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
          <div className="flex flex-col gap-2 w-fit">
            <Link
              className="text-blue-600 hover:underline"
              href={Routes.Main}
              onClick={resetDeploy}
            >
              {t('deploy.success.view-list')}
            </Link>
            {/* <Link
              className="text-blue-600 hover:underline"
              href={fmt.toHref(Routes.Main, chainName, deployedAddr)}
              onClick={resetDeploy}
            >
              {t('deploy.success.view-details')}
            </Link> */}
            <Link
              className="text-blue-600 hover:underline"
              href={fmt.toHref(explorer_tx, deployHash)}
              target="_blank"
              onClick={resetDeploy}
            >
              {t('deploy.success.view-hash')}
            </Link>
          </div>
        }
      />
    )
  }

  // It shouldn't have come to this.
  return <></>
}

export default CreateTokenStatusDialog
