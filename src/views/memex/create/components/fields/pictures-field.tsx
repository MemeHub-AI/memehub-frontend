import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'

import { FormField } from '@/components/ui/form'
import { useCreateTweetContext } from '@/contexts/memex/create-tweet'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/image-upload'
import { useUploadImage } from '@/hooks/use-upload-image'
import { Label } from '@/components/ui/label'

export const CreatePicturesField = () => {
  const { t } = useTranslation()
  const { form } = useCreateTweetContext()
  const { onChangeUpload } = useUploadImage()

  return (
    <FormField
      control={form.control}
      name="pictures"
      render={({ field }) => (
        <Button
          type="button"
          shadow="none"
          className="px-2"
          disabled={field.disabled}
        >
          <Label
            htmlFor="memex-upload"
            className="flex items-center"
            disabled={field.disabled}
          >
            <AiOutlinePicture size={22} className="mr-1" />
            {t('memex.create.add-pictures')}
          </Label>
          <ImageUpload
            className="invisible absolute"
            id="memex-upload"
            onChange={async (e) => {
              const src = await onChangeUpload(e)
              if (src) field.onChange([...field.value, src])
            }}
            disabled={field.disabled}
          />
        </Button>
      )}
    />
  )
}

export default CreatePicturesField
