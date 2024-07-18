import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { BiComment } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import React, {  ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLessThanEqual } from 'react-icons/fa6';

interface props extends ComponentProps<'div'>{
  // setConfirm : React.Dispatch<React.SetStateAction<boolean>>
}

export const InteractiveList = ({className}:props) => {
  
  
  const [confirm , setConfirm] = useState(false)
  const onConfirm = ()=>{
    setConfirm(true)
    // setIsopen(false)
  }
  const { t, i18n } = useTranslation()
  return <div className={cn("flex items-center  justify-between lg:w-[500px]", className)}>
    <div className='flex gap-7'>
      <div className=" flex items-center gap-2 text-lg text-gray-500 transition duration-350 ease-in-out">
        <Dialog>
          <DialogTrigger>
            <div className='flex items-center gap-2'>
              {confirm ?<FcLike /> : <FcLikePlaceholder className='cursor-pointer ' />}
              <span className='cursor-pointer'>10</span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader >
              <DialogTitle className='m-auto max-sm:ml-[3.3rem] max-sm:w-[60%]'>{t('sure.like')}</DialogTitle>
              <DialogDescription className='flex max-sm:ml-[-2.5rem]  items-center flex-col max-sm:w-[100vw]'>
                <Image src="/images/create-success.png" alt="" width={100} height={100} className='my-4'></Image>
                <div className='mb-4'>1 <FcLike className='w-8 h-8 inline-block ' /> = 0.009 BNB(5 USDT)</div>
                <div className={cn('max-sm:px-10 w-[400px]', i18n.language === 'zh' ? 'text-center' : 'text-start')}>
                  <span>{t('consensus.successful')}</span>
                  <div>{t('consensus.fails')}</div>
                </div>
                <div className='mt-2 gap-4 flex '>
                  <DialogClose className=' bg-yellow-200 w-20 h-8 rounded-md border border-black border-soli text-black' onClick={onConfirm}>{t('confirm')}</DialogClose>
                  <DialogClose className='border border-black border-solid w-20 h-8 rounded-md text-black'>
                    {t('cancel')}
                  </DialogClose>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" flex items-center gap-2 text-lg text-gray-500  transition duration-350 ease-in-out">
        <Dialog>
          <DialogTrigger className='flex items-center gap-2'>
            <BiComment className=' cursor-pointer' />
            <span className=' cursor-pointer'>14</span>
          </DialogTrigger>
          <DialogContent className='w-[320px]'>
            <DialogHeader >
              <DialogTitle className='m-auto'>{t('comments')}</DialogTitle>
              <DialogDescription className='flex items-center flex-col'>
                <textarea
                  rows={4}
                  className='border transition ease-in-out w-52 sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500'
                />
                <DialogFooter className='mt-2 gap-4 '>
                  <button className=' bg-yellow-200 w-20 h-8 rounded-md border border-black border-soli text-black'>{t('confirm')}</button>
                  <DialogClose className='border border-black border-solid w-20 h-8 rounded-md text-black'>
                    {t('cancel')}
                  </DialogClose>
                </DialogFooter>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <div>
      <div className="cursor-pointer flex items-center gap-1 text-lg text-gray-600 transition duration-350 ease-in-out">
        <img src="/images/bsc.svg" alt="" className='w-4 h-4'/>
        <span className='  text-sm text-black'>BNB Chain</span>
      </div>
    </div>
  </div>
}