import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  hash: string | undefined
  contractAddress: string | undefined
}

export const CreateTokenSuccessDialog = (props: Props) => {
  const { open, onOpenChange, hash, contractAddress } = props
  const { t } = useTranslation()

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deploy.success')}
      description={
        <p className="flex flex-col gap-2">
          <Link
            className="text-blue-600 hover:underline"
            href={hash ? `https://scrollscan.com/tx/${hash}` : ''}
            target="_blank"
          >
            {t('view.hash')}
          </Link>
          <Link
            className="text-blue-600 hover:underline"
            href={contractAddress ? `${Routes.Token}/${contractAddress}` : ''}
          >
            {t('view.details')}
          </Link>
          <Link className="text-blue-600 hover:underline" href={Routes.Main}>
            {t('view.list')}
          </Link>
        </p>
      }
    />
  )
}

export default CreateTokenSuccessDialog
