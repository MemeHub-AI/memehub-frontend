import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'

import { FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useCreateIdeaDetailsContext } from '@/contexts/memex/create-idea-detail'
import { ImageUpload } from '@/components/image-upload'
import { Label } from '@/components/ui/label'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'

export const RequiredFields = () => {
  const { t } = useTranslation()
  const { form, isUpdating } = useCreateIdeaDetailsContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const { onChangeUpload, clearFile } = useUploadImage({
    inputEl: inputRef.current,
  })

  return (
    <div className="space-y-2 mt-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('name')}*</FormLabel>
            <div>
              <Input
                placeholder={t('name')}
                className="px-2"
                {...field}
                disabled={isUpdating || field.disabled}
              />
              <FormMessage />
            </div>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="symbol"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('ticker')}*</FormLabel>
            <div>
              <Input
                placeholder={t('ticker')}
                className="px-2"
                {...field}
                disabled={isUpdating || field.disabled}
              />
              <FormMessage />
            </div>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('logo')}*</FormLabel>
            <div className="flex items-center space-x-2">
              <Label
                className={cn(
                  'border-2 border-black rounded-md w-fit cursor-pointer sm:hover:bg-zinc-200',
                  field.value ? 'overflow-hidden' : 'p-1.5'
                )}
                htmlFor="create-detail-logo"
                disabled={isUpdating || field.disabled}
                onClick={clearFile}
              >
                {field.value ? (
                  <img src={field.value} alt="logo" className="w-11 h-11" />
                ) : (
                  <AiOutlinePicture size={28} />
                )}

                <ImageUpload
                  id="create-detail-logo"
                  placeholder={t('name')}
                  className="hidden"
                  ref={inputRef}
                  onChange={async (e) => {
                    const src = await onChangeUpload(e)
                    if (src) field.onChange(src)
                  }}
                  disabled={isUpdating || field.disabled}
                />
              </Label>
            </div>
            {field.value && <p>{fmt.fileName(field.value)}</p>}
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="desc"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('description')}*</FormLabel>
            <div>
              <Textarea
                placeholder={t('description')}
                className="px-2"
                disableFocusBorder
                rows={5}
                {...field}
                disabled={isUpdating || field.disabled}
              />
              <FormMessage />
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default RequiredFields
