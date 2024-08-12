import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useCreateDetailContext } from '@/contexts/memex/create-detail'
import { ImageUpload } from '@/components/image-upload'
import { Label } from '@/components/ui/label'
import { fmt } from '@/utils/fmt'

export const RequiredFields = () => {
  const { t } = useTranslation()
  const { form } = useCreateDetailContext()
  const { file, onChangeUpload } = useUploadImage()

  return (
    <div className="space-y-2 mt-2">
      <FormField
        control={form.control}
        name="symbol"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('ticker')}</FormLabel>
            <div>
              <Input placeholder={t('ticker')} className="px-2" {...field} />
              <FormMessage />
            </div>
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('name')}</FormLabel>
            <div>
              <Input placeholder={t('name')} className="px-2" {...field} />
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
            <FormLabel className="font-bold">{t('logo')}</FormLabel>
            <div className="flex items-center space-x-2">
              <Label
                className="border-2 border-black p-1.5 rounded-md w-fit"
                htmlFor="create-detail-logo"
              >
                <AiOutlinePicture size={28} />
                <ImageUpload
                  id="create-detail-logo"
                  placeholder={t('name')}
                  className="invisible absolute"
                  onChange={async (e) => {
                    const src = await onChangeUpload(e)
                    if (src) field.onChange(src)
                  }}
                />
              </Label>
            </div>
            {file && <p>{fmt.fileName(file?.name)}</p>}
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name="desc"
        render={({ field }) => (
          <div>
            <FormLabel className="font-bold">{t('description')}</FormLabel>
            <div>
              <Textarea
                placeholder={t('description')}
                className="px-2"
                rows={5}
                {...field}
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
