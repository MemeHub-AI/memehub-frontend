import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PrimaryLayout from '@/components/layouts/primary'
import { cn } from '@/lib/utils'
import { MdCancel } from 'react-icons/md'
import Image from 'next/image'
import { AiOutlinePicture } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { IoIosArrowBack } from 'react-icons/io'
import { IoNewspaperOutline } from 'react-icons/io5'
import { Routes } from '@/routes'
import { Button } from '@/components/ui/button'
import { ChainSelect } from '@/components/chain-select'
import { Textarea } from '@/components/ui/textarea'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu'
import { toast } from 'sonner'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMemexDetailStore } from '@/stores/use-memex-detail'
import { useCreateMainForm } from './hooks/use-main-form'
import { useChainsStore } from '@/stores/use-chains-store'
import { useAccount } from 'wagmi'

const CreatePost = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const { formData } = useMemexDetailStore()
  const mainForm = useCreateMainForm()
  const { chainId } = useAccount()
  console.log(formData?.getValues())

  console.log('a' + formData)

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(target.files!)
    console.log(files)

    if (files.length + selected.length > 4) {
      toast('You can only upload a maximum of 4 images')
      return
    }
    const newImages = files.map((file) => URL.createObjectURL(file))
    console.log(newImages)

    setSelected((prevImages) => [...prevImages, ...newImages])
  }

  const nav = () => {
    router.push('/memex/create/detail')
  }

  const removeImage = (index: number) => {
    setSelected((prevImages) => prevImages.filter((_, i) => i !== index))
  }
  return (
    <PrimaryLayout className="w-full">
      <div className="pb-3">
        <Form {...mainForm}>
          <form
            onSubmit={mainForm?.handleSubmit(() => {
              console.log(mainForm.getValues())
            })}
          >
            <div className=" flex justify-between mt-1 mb-3 text-center lg:w-[500px] pr-1 items-center sm:w-2/3 sm:pr-6 md:w-[325px]">
              <div
                onClick={() => {
                  router.push(Routes.Memex)
                }}
                className="flex items-center cursor-pointer h-[35px] gap-2"
              >
                <span className="text-2xl leading-[35x] font-thin">
                  <IoIosArrowBack />
                </span>
                <span className="font-medium">{t('create.post')}</span>
              </div>
              <Button className={cn('bg-blue-600 h-8 text-white')}>
                {t('post')}
              </Button>
            </div>
            <div className="relative">
              <Image
                className="h-10 w-10 rounded-full absolute translate-x-1  translate-y-1"
                src="/favicon.ico"
                alt=""
                width={50}
                height={50}
              />
              <FormField
                control={mainForm?.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      {...field}
                      id="postContent"
                      name="postContent"
                      rows={3}
                      className=" max-sm:ml-[-1.6rem] sm:w-2/3 text-lg text-gray-400 border-0 lg:w-[500px] max-sm:w-[calc(100%+34px)] py-2 pl-14 max-sm:pl-20  sm:leading-8 md:w-[325px] shadow-none focus:shadow-none focus-visible:ring-0"
                      placeholder={t('mind')}
                    ></Textarea>
                  </FormItem>
                )}
              ></FormField>
              {selected.length !== 0 && (
                <Carousel className="w-full">
                  <CarouselContent className="pl-14 h-36 my-2">
                    {selected.map((image, index) => (
                      <CarouselItem key={index} className="relative basis-1/2 ">
                        <img
                          src={image}
                          alt={`Selected ${index}`}
                          className="object-cover object-center rounded-lg w-full h-full"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 text-2xl"
                        >
                          <MdCancel />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
              <div
                className={cn(
                  '  bg-gray-400 h-[0.7px] mr-[-0.7rem] pl-[-5px] my-1 ml-[-1.5rem] sm:mr-[-1.4rem] md:w-[325px] lg:w-[500px] md:ml-1'
                )}
              ></div>
            </div>
            <div>{t('chain')}</div>

            <FormField
              control={mainForm.control}
              name={'chainName'}
              render={({ field }) => (
                <FormItem className="mt-0 mb-2">
                  <FormControl>
                    <ChainSelect
                      defaultValue={chainId?.toString()}
                      value={field.value}
                      onChange={(c) => field.onChange(c.name)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 mb-4">
              <div className="relative border-2 border-black rounded-md px-1 py-1 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out max-w-sm:w-[37%]">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full  h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={onChange}
                />
                <div className="flex items-center">
                  <AiOutlinePicture className="w-8 h-8" />
                  <span className="ml-2 text-sm text-gray-600">
                    {t('picture')}
                  </span>
                </div>
              </div>
              <div className="relative border-2 border-black rounded-md px-1 py-1 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out max-w-sm:w-[37%]">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={nav}
                      >
                        <IoNewspaperOutline className="w-8 h-8" />
                        <span className="ml-2 text-sm text-gray-600 ">
                          {t('token.detail')}
                        </span>
                      </div>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="  text-[#7aa93a] font-medium">{t('choose')}</div>
            <div className="  text-[#7aa93a] font-medium">
              {t('least.string')}
            </div>
            <div className=" text-[#7aa93a]  font-medium">{t('least.img')}</div>
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
          </form>
        </Form>
      </div>
    </PrimaryLayout>
  )
}

export default CreatePost
