import React, { useEffect, useRef, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { createField, useFields } from '@/hooks/use-fields'
import { FormTextareaField } from '@/components/form-field'
import { FormInputField } from '@/components/form-input-field'
import { RequirePick } from '@/utils/types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { useAccountContext } from '@/contexts/account'

interface Props extends RequirePick<ComponentProps<'div'>, 'children'> {}

export const ProfileForm = ({ children }: Props) => {
  const { t } = useTranslation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { userInfo, refetchUserInfo } = useAccountContext()
  const { fields, fieldsKeys, updateField, validateFields } = useFields({
    name: createField({
      isRequired: true,
      validate: (f) => (isEmpty(f.value?.trim()) ? t('field.empty') : null),
    }),
    bio: createField({}),
  })
  const { update } = useUser()

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(target.id as keyof typeof fields, {
      value: target.value,
    })
  }

  const onSubmit = () => {
    if (!validateFields()) return

    // Update user info & refresh.
    update({
      name: fields.name.value,
      description: fields.bio.value,
    }).then(() => refetchUserInfo())

    // Clear form & close.
    updateField('name', { value: '' })
    updateField('bio', { value: '' })
    closeRef.current?.click()
  }

  useEffect(() => {
    if (!userInfo) return

    updateField('name', { value: userInfo.name })
    updateField('bio', { value: userInfo.description })
  }, [userInfo])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('account.profile.edit')}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <FormInputField
            autoFocus
            label={t('name')}
            placeholder={t('username.placeholder')}
            id={fieldsKeys.name}
            isRequired={fields.name.isRequired}
            error={fields.name.error}
            value={fields.name.value}
            onChange={onChange}
            className="border-none"
          />
          <FormTextareaField
            label={t('bio')}
            placeholder={t('bio.placeholder')}
            id={fieldsKeys.bio}
            value={fields.bio.value}
            onChange={onChange}
            disableFocusBorder
          />
          <DialogFooter className="!justify-start max-sm:flex-row max-sm:gap-0">
            <Button variant="default">{t('confirm')}</Button>
            <DialogClose ref={closeRef} asChild>
              <Button variant="outline" type="button" className="max-sm:ml-3">
                {t('cancel')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileForm
