import React from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { FormField, FormItem } from '@/components/ui/form'
import { PicturesPreview } from '../pictures-preview'
import { useUserStore } from '@/stores/use-user-store'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { memexCreateConfig } from '@/config/memex/idea'

export const CreateIdeaTextareaField = () => {
  const { t } = useTranslation()
  const { form, isCreating } = useCreateIdeaContext()
  const { userInfo } = useUserStore()

  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <div className="flex space-x-1 mx-3">
            <Avatar src={userInfo?.logo} alt="avatar" className="mt-2" />
            <div className="flex flex-col w-full">
              <Textarea
                placeholder={`${t('memex.create.placeholder').split('$')[0]}\n${
                  t('memex.create.placeholder').split('$')[1]
                }`}
                disableFocusBorder
                className="border-none shadow-none focus:shadow-none text-base mt-0.5 px-1 caret-[2px]"
                rows={7}
                maxLength={memexCreateConfig.maxChar}
                {...field}
                disabled={isCreating || field.disabled}
              />
              <PicturesPreview
                disabled={isCreating || field.disabled}
                className="mt-2"
              />
            </div>
          </div>
          <Separator />
        </FormItem>
      )}
    />
  )
}

export default CreateIdeaTextareaField
