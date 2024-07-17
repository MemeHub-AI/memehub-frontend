import React, { useState } from 'react'
import PrimaryLayout from '@/components/layouts/primary'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import { AiOutlinePicture } from "react-icons/ai";
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { IoIosArrowBack } from "react-icons/io";
const CreatePost = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const [selected, setSelected] = useState(0)
    const imgs = ['/favicon.ico', '/favicon.ico', '/favicon.ico']
    return (
        <PrimaryLayout container="div" className={cn('w-full')}>
            <div className=' flex justify-between mt-1 mb-3 text-center items-center'>
                {/* <span className='mr-1 text-3xl font-light mb-1'>&lt;</span> */}
                <div onClick={() => { router.push(Routes.Posts) }} className='flex items-center cursor-pointer'><IoIosArrowBack className='h-10'/>{t('create.post')}</div>
                <Button className={cn()}>
                    {t('post')}
                </Button>
            </div>
            <div className="">
                <Image className="h-10 w-10 rounded-full absolute translate-x-1  translate-y-1" src="/favicon.ico" alt="" width={50} height={50} />
                <textarea
                    id="postContent"
                    name="postContent"
                    rows={5}
                    className="ml-[-1.5rem] w-[calc(100%+45px)] border-b-2 py-2 pl-20 transition ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500"
                    placeholder={t('mind')}
                ></textarea>
            </div>
            <div>Chain</div>
            <div className='flex py-1'>
                {imgs.map((img, i) => {
                    return <div onClick={() => { setSelected(i) }} className={cn(i === 0 && 'rounded-l-lg', 'border border-solid border-black cursor-pointer my-1', i === 2 && 'rounded-r-lg', i === selected && 'bg-red-600')}><Image src={imgs[i]} alt="" width={30} height={30}></Image></div>
                })}
            </div>
            <div className='flex gap-3 mb-4'>
                <div className="relative border-2 rounded-md px-4 py-3 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out w-2/5 xl:w-[310px]">
                    <input type="file" id="fileAttachment" name="fileAttachment" className="absolute inset-0 w-full  h-full opacity-0 cursor-pointer" accept="image/*" />
                    <div className="flex items-center">
                        <AiOutlinePicture />
                        <span className="ml-2 text-sm text-gray-600">add pictrue</span>
                    </div>
                </div>
                <div className="relative border-2 rounded-md px-4 py-1 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out w-2/5 xl:w-[310px]">
                    <input type="file" id="fileAttachment" name="fileAttachment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="ml-2 text-sm text-gray-600">token detail</span>
                    </div>
                </div>
            </div>
            <div className=' text-green-400'>{t('choose')}</div>
            <div className=' text-green-400'>{t('least.string')}</div>
            <div className=' text-green-400'>{t('least.img')}</div>
            <div className={cn(' mt-4 w-2/3  rounded-md max-sm:w-full p-2 text-black lg:w-[500px] bg-[#e3e9fd]')}>
                <div>{t('build.consensus')}</div>
                <div>{t('get.token')}</div>
                <div>{t('like.consensus')}</div>
                <div>{t('start.vacation')}</div>
            </div>
        </PrimaryLayout>
    )
}

export default CreatePost