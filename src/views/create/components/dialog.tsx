import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'
import { useDeploy } from '../hooks/use-deploy'
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { isUserReject } from '@/utils/contract'

interface Props extends ReturnType<typeof useDeploy> {}

export const CreateTokenStatusDialog = (props: Props) => {
  const {
    deployedAddress,
    tokenId,
    deployHash,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    submitError,
    confirmError,
    resetDeploy,
  } = props
  const { t } = useTranslation()

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
        title={t('deploy.submit.error') + ':'}
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
          {/* <p>
            {t('deploy.submit.success.view-hash')}:{' '}
            <Link
              href={`https://scrollscan.com/tx/${deployHash}`}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              {t('view')}
            </Link>
          </p> */}
        </DialogDescription>
      </Dialog>
    )
  }

  // Confirm error.
  if (confirmError) {
    return (
      <AlertDialog
        open={!!confirmError}
        title={t('deploy.confirm.error') + ':'}
        description={
          <p className="break-all line-clamp-3">{confirmError?.message}</p>
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
            <Link
              className="text-blue-600 hover:underline"
              href={`${Routes.Token}/${deployedAddress}`}
              onClick={resetDeploy}
            >
              {t('deploy.success.view-details')}
            </Link>
            {/* <Link
              className="text-blue-600 hover:underline"
              href={`https://scrollscan.com/tx/${deployHash}?id=${tokenId}`}
              target="_blank"
              onClick={resetDeploy}
            >
              {t('deploy.success.view-hash')}
            </Link> */}
          </div>
        }
      />
    )
  }

  // It shouldn't have come to this.
  return <></>
}

export default CreateTokenStatusDialog
