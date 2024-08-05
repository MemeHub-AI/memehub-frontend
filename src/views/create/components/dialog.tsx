import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { PiWarningCircle } from 'react-icons/pi'

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
      deployedAddr,
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
  const router = useRouter()

  const chainName = createTokenData?.chain?.name || ''
  const explorerUrl = createTokenData?.chain?.explorer_tx || ''

  const withIcon = (children: ReactNode) => {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <PiWarningCircle size={18} />
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
      toast.warning(t('user-rejected'))
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
        onCancel={resetDeploy}
        onConfirm={() => {
          resetDeploy()
          router.push(
            fmt.toHref(Routes.Main, chainName, deployedAddr || 'invalid')
          )
        }}
        showCancel={false}
        confirmText={t('go-to.buy')}
        align="center"
        title={
          <>
            <p>{t('deploy.success').split('$')[0]}</p>
            <p>{t('deploy.success').split('$')[1]}</p>
          </>
        }
        content={
          <div className="flex items-center justify-center my-8">
            <img
              src="/images/create-success.png"
              alt="poster"
              className="w-32"
            />
          </div>
        }
      />
    )
  }

  // It shouldn't have come to this.
  return <></>
}

export default CreateTokenStatusDialog
