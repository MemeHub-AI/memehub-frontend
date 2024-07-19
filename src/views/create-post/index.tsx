import React, { useState } from 'react'
import PrimaryLayout from '@/components/layouts/primary'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import { AiOutlinePicture } from 'react-icons/ai'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { IoIosArrowBack } from 'react-icons/io'
import { IoNewspaperOutline } from 'react-icons/io5'
import { FormChain } from '../create/components/form/chain'
import { useCreateTokenContext } from '@/contexts/create-token'
import { useDeploy } from '../create/hooks/use-deploy'
import { Form } from './components/Form'
import { useCreateTokenForm } from '../create/hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { CreateTokenProvider } from '@/contexts/create-token'
const CreatePost = () => {
  const { t } = useTranslation()
  // const deployResult = useDeploy()
  // const [tab, setTab] = useState(0)
  // const formData = useCreateTokenForm(deployResult)
  // const newsListData = useNewsList({ isOpportunity: tab === 1 })

  // console.log(deployResult);

  const router = useRouter()
  const [selected, setSelected] = useState(0)
  const [filename, setFilename] = useState<String>()
  const imgs = ['/favicon.ico', '/favicon.ico', '/favicon.ico']
  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.files && target.files[0]) {
      var name = target.files[0].name
      if (name.length > 12) {
        name = name.substring(0, 10) + '...'
      }
      setFilename(name)
    }
  }
  return (
    //     <CreateTokenProvider
    //   value={{
    //     formData,
    //     deployResult,
    //     newsListData,
    //   }}
    // >
    <PrimaryLayout container="div" className={cn('w-full')}>
      <div className="pb-3">
        <div className=" flex justify-between mt-1 mb-3 text-center items-center">
          {/* <span className='mr-1 text-3xl font-light mb-1'>&lt;</span> */}
          <div
            onClick={() => {
              router.push(Routes.Posts)
            }}
            className="flex items-center cursor-pointer text-lg"
          >
            <IoIosArrowBack className="h-10" />
            {t('create.post')}
          </div>
          <Button className={cn()}>{t('post')}</Button>
        </div>
        <div className="">
          <Image
            className="h-10 w-10 rounded-full absolute translate-x-1  translate-y-1"
            src="/favicon.ico"
            alt=""
            width={50}
            height={50}
          />
          <textarea
            id="postContent"
            name="postContent"
            rows={5}
            className=" ml-[-1.6em] sm:w-[calc(100%+45px)] max-sm:w-[calc(100%+34px)] border-b-2 py-2 pl-20 transition ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500"
            placeholder={t('mind')}
          ></textarea>
        </div>
        <div>{t('chain')}</div>
        <div className="flex py-1">
          {imgs.map((img, i) => {
            return (
              <div
                onClick={() => {
                  setSelected(i)
                }}
                className={cn(
                  i === 0 && 'rounded-l-lg',
                  'border border-solid border-black cursor-pointer my-1',
                  i === 2 && 'rounded-r-lg',
                  i === selected && 'bg-red-600'
                )}
              >
                <Image src={imgs[i]} alt="" width={30} height={30}></Image>
              </div>
            )
          })}
        </div>
        {/* <FormChain formData={FormData}/> */}
        {/* <Form/> */}
        <div className="flex gap-3 mb-4">
          <div className="relative border-2 border-black rounded-md px-1 py-1 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out max-w-sm:w-[37%] x-[33%] xl:w-[310px]">
            <input
              type="file"
              id="fileAttachment"
              name="fileAttachment"
              className="absolute inset-0 w-full  h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={onChange}
            />
            <div className="flex items-center">
              <AiOutlinePicture className="w-8 h-8" />
              <span className="ml-2 text-sm text-gray-600">
                {filename ? filename : t('picture')}
              </span>
            </div>
          </div>
          <div className="relative border-2 border-black rounded-md px-1 py-1 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out max-w-sm:w-[37%] xl:w-[310px]">
            <input
              type="file"
              id="fileAttachment"
              name="fileAttachment"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <div className="flex items-center">
              <IoNewspaperOutline className="w-8 h-8" />
              <span className="ml-2 text-sm text-gray-600">
                {t('token.detail')}
              </span>
            </div>
          </div>
        </div>
        <div className=" text-green-400 text-[#7aa93a]">{t('choose')}</div>
        <div className=" text-green-400 text-[#7aa93a]">
          {t('least.string')}
        </div>
        <div className=" text-green-400 text-[#7aa93a]">{t('least.img')}</div>
        <div
          className={cn(
            ' mt-4 w-2/3  rounded-md max-sm:w-full p-2 text-black lg:w-[500px] bg-[#e3e9fd]'
          )}
        >
          <div>{t('build.consensus')}</div>
          <div>{t('get.token')}</div>
          <div>{t('like.consensus')}</div>
          <div>{t('start.vacation')}</div>
        </div>
      </div>
    </PrimaryLayout>
    // </CreateTokenProvider>
  )
}

export default CreatePost
