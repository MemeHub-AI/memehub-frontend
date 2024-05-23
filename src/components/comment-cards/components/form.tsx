import React, { useMemo, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createField, useFields } from '@/hooks/use-fields'
import { FormTextareaField } from '@/components/form-field'
import { Label } from '@/components/ui/label'
import { useUploadImage } from '@/hooks/use-upload-image'
import { ImageUpload } from '@/components/image-upload'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onComment?: (content: string, mentions: [], image?: string) => void
}

export const CommentForm = (props: Props) => {
  const { className, onComment } = props
  const { t } = useTranslation()
  const { fields, updateField } = useFields({
    comment: createField({}),
  })
  const { url, file, onChangeUpload, clearFile } = useUploadImage()
  // Generate unique id.
  const inputId = useMemo(nanoid, [])
  const textareaId = useMemo(nanoid, [])

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField('comment', { value: target.value })
  }

  const onSubmit = () => {
    const comment = fields.comment.value.trim()

    if (isEmpty(comment)) {
      return toast.error(t('comment.empty'))
    }

    onComment?.(comment, [], url)
    updateField('comment', { value: '' })
    clearFile()
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
        id={textareaId}
        label={t('comment.new')}
        placeholder={t('comment-placeholder')}
        value={fields.comment.value}
        onChange={onChange}
        rows={4}
      />

      <div className="flex items-center gap-2">
        <Button className="px-10">{t('comment')}</Button>
        <Label htmlFor={inputId} variant="icon">
          <ImageIcon className="cursor-pointer" />
        </Label>
        {file && <p>{file?.name}</p>}
        <ImageUpload
          id={inputId}
          onChange={onChangeUpload}
          className="hidden"
        />
      </div>
    </form>
  )
}
