import React from 'react'
import { useRouter } from 'next/router'
import { IoCloseOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { AiOutlinePicture } from 'react-icons/ai'
import { Textarea } from '@/components/ui/textarea'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { FaArrowDown } from 'react-icons/fa6'
import { FaArrowUp } from 'react-icons/fa6'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
// import { useCreateDetailForm } from '../hooks/use-form'
import { z } from 'zod'
import PrimaryLayout from '@/components/layouts/primary'
import { useMemexDetailStore } from '@/stores/use-memex-create'
import { useCreateDetailForm } from '../hooks/use-detail-form'
import { useUploadImage } from '@/hooks/use-upload-image'

const Detailed = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useCreateDetailForm()
  const { detailFormData: formData } = useMemexDetailStore()
  console.log(formData?.getValues())

  const [isOpen, setIsOpen] = React.useState(false)
  const { onChangeUpload, isUploading } = useUploadImage({
    onSuccess: (url) => {
      form.setValue('logo', url)
    },
  })

  const navBack = () => {
    router.back()
  }
  return (
    <PrimaryLayout className="w-full">
      <div className="pb-3">
        <div className="space-y-4">
          <Form {...form!}>
            <form
              onSubmit={form?.handleSubmit(async () => {
                const isValid = await form.trigger()

                if (!isValid) return
                console.log(form.getValues())
              })}
            >
              <div className=" flex justify-between mt-1 mb-2 text-center lg:w-[500px] pr-1 items-center sm:w-2/3 sm:pr-6 md:w-[325px]">
                {/* <span className='mr-1 text-3xl font-light mb-1'>&lt;</span> */}
                <div
                  onClick={() => {
                    navBack()
                  }}
                  className="flex items-center cursor-pointer h-[35px] gap-2"
                >
                  {/* <IoIosArrowBack className="text-lg" /> */}
                  <span className="text-2xl leading-[35x] font-thin">
                    <IoCloseOutline />
                  </span>
                  <span className="font-medium">{t('memecoin.detailed')}</span>
                </div>

                <Button
                  disabled={isUploading}
                  className={cn('bg-black text-white rounded-3xl h-7 px-5')}
                >
                  {t('confirm')}
                </Button>
              </div>
              <FormField
                control={form?.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-medium text-base">
                      {t('ticker')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="md:w-[325px] lg:w-[500px]"
                        placeholder={field.value ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form?.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-medium text-base">
                      {t('name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="md:w-[325px] lg:w-[500px]"
                        placeholder={field.value ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div>
                <span className="font-medium">{t('logo')}</span>
                <FormField
                  control={form?.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative px-1 border border-black w-10 cursor-pointer">
                          <input
                            type="file"
                            {...field}
                            value={''}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={onChangeUpload}
                          />
                          {field.value ? (
                            <img src={field.value} alt="" />
                          ) : (
                            <AiOutlinePicture className="text-3xl" />
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form?.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-medium text-base">
                      {t('description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="md:w-[325px] lg:w-[500px]"
                        placeholder={field.value ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger>
                  {isOpen ? (
                    <div className="flex items-center gap-1 text-blue-700">
                      {t('hide.options')}
                      <FaArrowUp />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-700">
                      {t('show.options')}
                      <FaArrowDown />
                    </div>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2">
                    <FormField
                      control={form?.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="font-medium text-base">
                            {t('twitter.link')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="md:w-[325px] lg:w-[500px]"
                              {...field}
                              placeholder={
                                field.value ? field.value : `(${t('optional')})`
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form?.control}
                      name="telegram"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="font-medium text-base">
                            {t('telegram.link')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="md:w-[325px] lg:w-[500px]"
                              {...field}
                              placeholder={
                                field.value ? field.value : `(${t('optional')})`
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form?.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="font-medium text-base">
                            {t('website')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="md:w-[325px] lg:w-[500px]"
                              {...field}
                              placeholder={
                                field.value ? field.value : `(${t('optional')})`
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </form>
          </Form>
        </div>
        <div
          className={cn(
            ' mt-4 w-2/3 border border-black rounded-md max-sm:w-full p-2 text-black lg:w-[500px] bg-[#e3e9fd] md:w-[325px] space-y-2'
          )}
        >
          <div className="font-bold text-xl">{t('game.introduce')}</div>
          <div>{t('post.idea')}</div>
          <div>{t('accumulate.like')}</div>
          <div>{t('poster.reward')}</div>
        </div>
      </div>
    </PrimaryLayout>
  )
}

export default Detailed