import { useTranslation } from 'react-i18next'
import { AiOutlinePicture } from 'react-icons/ai'

import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useUserStore } from '@/stores/use-user-store'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/image-upload'
import { useCommentForm } from '../hooks/use-comment-form'
import { Form, FormField } from '@/components/ui/form'
import { useUploadImage } from '@/hooks/use-upload-image'
import { Label } from '@/components/ui/label'
import { GridImages } from '@/components/grid-images'
import { utilLang } from '@/utils/lang'
import { postCommentImgMax } from '@/config/memex/post'

export const DetailsCommentForm = () => {
  const { t } = useTranslation()
  const { userInfo } = useUserStore()
  const { onChangeUpload } = useUploadImage()
  const { form, onSubmit } = useCommentForm()

  return (
    <Form {...form}>
      <form
        className="border-y p-3 mt-3 flex space-x-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Avatar src={userInfo?.logo} fallback={userInfo?.name[0]} />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <Textarea
                placeholder={t('memex.details.comment-placehoder')}
                className="border-none px-0 py-0.5 text-base shadow-none"
                disableFocusBorder
                disableFocusShadow
                {...field}
              />
            )}
          />
          <GridImages urls={form.getValues('images')} />
          <div className="flex space-x-2 items-center mt-2 mb-1">
            <Button
              variant="purple"
              shadow="none"
              size="sm"
              className="rounded-full !min-w-14"
            >
              {t('comment')}
            </Button>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <Label htmlFor="post-details-image">
                  <AiOutlinePicture size={28} className="text-purple-700" />
                  <ImageUpload
                    id="post-details-image"
                    className="hidden"
                    disabled={field.disabled}
                    onChange={async (e) => {
                      if (field.value.length >= postCommentImgMax) {
                        form.setError('images', {
                          message: utilLang.replace(t('iamges.max'), [
                            postCommentImgMax,
                          ]),
                        })
                        return
                      }
                      const url = await onChangeUpload(e)
                      if (url) field.onChange([...field.value, url])
                    }}
                  />
                </Label>
              )}
            />
          </div>
          {Object.entries(form.formState.errors).map(([_, err]) => (
            <p className="text-xs leading-none text-red-500">{err.message}</p>
          ))}
        </div>
      </form>
    </Form>
  )
}

export default DetailsCommentForm
