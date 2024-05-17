import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createField, useFields } from '@/hooks/use-fields'
import { FormTextareaField } from '@/components/form-field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit?: (
    data: Record<string, string>,
    e: React.FormEvent<HTMLFormElement>
  ) => void
}

export const CommentForm = (props: Props) => {
  const { className } = props
  const { t } = useTranslation()
  const { fields, updateField } = useFields({
    comment: createField({}),
  })

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(target.id as keyof typeof fields, { value: target.value })
  }

  const onSubmit = () => {
    const comment = fields.comment.value.trim()

    if (isEmpty(comment)) {
      toast.error(t('comment.empty'))
      return
    }

    console.log('send comment', comment)
  }

  return (
    <form
      className={cn('space-y-2', className)}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <FormTextareaField
        id="comment"
        label={t('comment.new')}
        placeholder={t('comment-placeholder')}
        value={fields.comment.value}
        onChange={onChange}
        rows={4}
      />

      <div className="flex items-center gap-2">
        <Button className="px-10">{t('comment')}</Button>
        <Label htmlFor="comment-img" variant="icon">
          <ImageIcon className="cursor-pointer" />
        </Label>
        <Input type="file" id="comment-img" className="hidden" />
      </div>
    </form>
  )
}
