import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'
import { toast } from 'sonner'

import { FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/image-upload'
import { useUploadImage } from '@/hooks/use-upload-image'
import { Label } from '@/components/ui/label'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { memexCreateConfig } from '@/config/memex/idea'
import { utilLang } from '@/utils/lang'

export const CreateIdeaPicturesField = () => {
  const { t } = useTranslation()
  const { form, isCreating } = useCreateIdeaContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const { onChangeUpload, clearFile } = useUploadImage({
    inputEl: inputRef.current,
  })

  return (
    <FormField
      control={form.control}
      name="pictures"
      render={({ field }) => (
        <Button
          type="button"
          shadow="none"
          className="px-2 sm:hover:bg-zinc-200"
          disabled={field.disabled || isCreating}
        >
          <Label
            htmlFor="memex-upload"
            className="flex items-center cursor-pointer"
            disabled={field.disabled}
            onClick={clearFile}
          >
            <AiOutlinePicture size={22} className="mr-1" />
            {t('memex.create.add-pictures')}
          </Label>
          <ImageUpload
            className="invisible absolute"
            id="memex-upload"
            ref={inputRef}
            onChange={async (e) => {
              if (field.value.length >= memexCreateConfig.maxImage) {
                toast.error(
                  utilLang.replace(t('memex.create.max-image'), [
                    memexCreateConfig.maxImage,
                  ])
                )
                return
              }
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
