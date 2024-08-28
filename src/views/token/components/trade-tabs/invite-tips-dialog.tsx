import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { useSessionStorage } from '@/hooks/use-storage'

export const InviteTipsDialog = ({
  open,
  onOpenChange,
}: Pick<ComponentProps<typeof AlertDialog>, 'open' | 'onOpenChange'>) => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { removeStorage } = useSessionStorage()

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={<span className="text-red-500">{t('invite.invalid')}</span>}
      content={
        <div>
          <p>{t('invite.invalid.desc')}</p>
          <ul>
            <li>- {t('invite.invalid.reason1')}</li>
            <li>- {t('invite.invalid.reason2')}</li>
          </ul>
        </div>
      }
      confirmText={t('clear-it')}
      onConfirm={() => {
        // Clear invite code
        query.r = ''
        removeStorage('invite_code')
        router.replace({ pathname: router.pathname, query }, undefined, {
          shallow: true,
        })
      }}
    />
  )
}

export default InviteTipsDialog
