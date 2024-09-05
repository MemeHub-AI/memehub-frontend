import React, { useMemo, useRef, type ComponentProps } from 'react'
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
import { shadowVariants } from '@/styles/variants/offset-shadow'
import { useTokenContext } from '@/contexts/token'
import { ConnectWallet } from '@/components/connect-wallet'
import { useAccount } from 'wagmi'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  isCommenting?: boolean
  showEmptyTips?: boolean
  showCancel?: boolean
  buttonText?: string
  buttonClass?: string
  autoFocus?: boolean
  onComment?: (content: string, mentions: [], image?: string) => void
  onCommentClick?: () => void
  onCancel?: () => void
}

export const CommentForm = (props: Props) => {
  const {
    className,
    isCommenting,
    showEmptyTips = true,
    showCancel = false,
    buttonText,
    buttonClass,
    onComment,
    onCommentClick,
    onCancel,
    autoFocus,
  } = props
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { fields, updateField } = useFields({
    comment: createField({}),
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const { url, file, isUploading, onChangeUpload, clearFile } = useUploadImage({
    inputEl: inputRef.current,
  })
  // Generate unique id.
  const inputId = useMemo(nanoid, [])
  const textareaId = useMemo(nanoid, [])
  const { isNotFound } = useTokenContext()
  const disabled = isCommenting || isUploading || isNotFound

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField('comment', { value: target.value })
  }

  const onSubmit = () => {
    const comment = fields.comment.value.trim()
    if (isEmpty(comment) && isEmpty(url)) {
      if (showEmptyTips) toast.error(t('comment.empty'))
      return
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
        disabled={disabled}
        autoFocus={autoFocus}
      />

      <div className="flex items-center">
        <ConnectWallet>
          <Button
            className={cn('px-10 max-sm:px-5', buttonClass)}
            disabled={disabled}
            onClick={onCommentClick}
          >
            {buttonText ?? t('comment')}
          </Button>
        </ConnectWallet>
        {showCancel && (
          <Button
            type="button"
            className="px-10 ml-2 max-sm:px-5"
            disabled={disabled}
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        )}
        {isConnected && (
          <Label
            htmlFor={inputId}
            variant="icon"
            className={cn(shadowVariants(), 'shadow ml-2 flex-shrink-0')}
            disabled={disabled}
            onClick={clearFile}
          >
            <ImageIcon className="cursor-pointer" />
          </Label>
        )}
        <ImageUpload
          ref={inputRef}
          id={inputId}
          disabled={disabled}
          onChange={onChangeUpload}
          className="hidden ml-2"
        />
      </div>
      {file && <p className="truncate text-gray-500">{file?.name}</p>}
    </form>
  )
}
