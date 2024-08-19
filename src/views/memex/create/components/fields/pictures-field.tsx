import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'

import { FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/image-upload'
import { useUploadImage } from '@/hooks/use-upload-image'
import { Label } from '@/components/ui/label'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'

export const CreateIdeaPicturesField = () => {
  const { t } = useTranslation()
  const { form, isCreating } = useCreateIdeaContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const { onChangeUpload } = useUploadImage({ inputEl: inputRef.current })

  return (
    <FormField
      control={form.control}
      name="pictures"
      render={({ field }) => (
        <Button
          type="button"
          shadow="none"
          className="px-2"
          disabled={field.disabled || isCreating}
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
            ref={inputRef}
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

export default CreateIdeaPicturesField
