import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { PiWarningCircle } from 'react-icons/pi'
import { toast } from 'sonner'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useCreateTokenContext } from '@/contexts/create-token'
import { joinPaths } from '@/utils'
import { isUserReject } from '@/utils/contract'

const withWarningIcon = (children: ReactNode) => {
  return (
    <div className="flex items-center gap-2 text-red-500">
      <PiWarningCircle size={20} />
      {children}
    </div>
  )
}

export const CreateTokenStatusDialog = () => {
  const { t } = useTranslation()
  const {
    deployedAddr,
    createTokenData: { chain } = {},
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isCreatingToken,
    submitError,
    confirmError,
    resetDeploy,
  } = useCreateTokenContext()
  const router = useRouter()

  // Backend create
  if (isCreatingToken) {
    return (
      <AlertDialog
        open={!!isCreatingToken}
        title={t('deploy.backend.submitting')}
        description={t('deploy.backend.submitting.desc')}
        showFooter={false}
      />
    )
  }

  // Contract submiting
  if (isSubmitting) {
    return (
      <Dialog
        open={!!isSubmitting}
        contentProps={{ onCloseClick: resetDeploy }}
      >
        <DialogTitle>{t('deploy.submit.title')}</DialogTitle>
        <DialogDescription>{t('deploy.submit.description')}</DialogDescription>
      </Dialog>
    )
  }

  // Submit error
  if (submitError) {
    if (isUserReject(submitError)) return
    return (
      <AlertDialog
        open={!!submitError}
        title={withWarningIcon(t('deploy.submit.error') + ':')}
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
        open={!!isConfirming}
        contentProps={{ onCloseClick: resetDeploy }}
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
        title={withWarningIcon(t('deploy.confirm.error') + ':')}
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

  // Successful!
  if (isDeploySuccess) {
    return (
      <AlertDialog
        open={!!isDeploySuccess}
        showClose={true}
        onCancel={resetDeploy}
        onConfirm={() => {
          resetDeploy()
          if (!chain || !deployedAddr) {
            toast.error(
              `${t('deploy.err.chain-addr-missing')} ${chain} ${deployedAddr}`
            )
            return
          }
          router.push(joinPaths(Routes.Main, chain, deployedAddr))
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
