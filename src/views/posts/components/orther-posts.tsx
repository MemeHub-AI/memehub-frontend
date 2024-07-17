import React from 'react'
import { cn } from '@/lib/utils'
import { InteractiveList } from './ui/interactive-list';
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Imgs from './ui/imgs';
import { FaTwitter } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Props {
  posts : any[]
}

export const OrtherPosts = ({posts}:Props) => {
  const { t } = useTranslation()
  const imgs = ['/favicon.ico', '/images/ai.jpg']
  return <div className={cn('')}>
    <div className="flex items-center">
      <div className='shrink-0'>
        <img className="inline-block h-10 w-10 rounƒded-full" src="/favicon.ico" alt="" />
      </div>
      <div className="ml-4 flex max-lg:justify-between w-full items-center">
        <div>
          <p className="text-base leading-6 font-medium text-black ">
            Sonali Hiraveee
            <span className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-300 transition ease-in-out duration-150 pl-3">
              20分钟
            </span>
          </p>
        </div>
        {true ?
          <div className='bg-purple-500 flex justify-center items-center rounded-md p-1 text-white lg:ml-8'>
            🚀  {t('succeed')}
          </div> :
          <span className="text-sm font-medium text-green-500 lg:ml-8">
            20H:20M
          </span>
        }
      </div>
    </div>
    {true && <Button className=' bg-yellow-200 rounded-md h-8 gap-1 ml-14 mb-2'><PiPencilSimpleLineThin />{false ? t('token.detail') : t('Claim') + ` 0.1% $PEPE`}</Button>}
    <div className="pl-14 ">
      <p className="text-base width-auto font-medium text-black flex-shrink lg:w-[500px]" >
        Day 07 of the challenge
        I was wondering what I can do with , so just started building
        Twitter UI using Tailwind and so far it looks so promising. I will post my code after completion.
        [07/100]
      </p>
      {/* 判断这个币时候已经发射 */}
      {true && <div className=' border border-solid border-gray-400 rounded-md mt-2 lg:w-[500px]'>
        <div className='relative'>
          <Image className='absolute m-2' src="/favicon.ico" alt="" width={38} height={38}></Image>
          <div className='ml-14 pt-1'>
            <div><span className='text-gray-500'>代号：</span>HEYI</div>
            <div><span className='text-gray-500'>全称：</span>Binance HeYi</div>
          </div>
        </div>
        <div className='flex px-2 my-2 max-lg:justify-between items-center'>
          <div className='flex text-2xl gap-2'>
            <FaTwitter />
            <FaTelegramPlane />
            {true && <TbWorld />}
          </div>
          <Button className='border border-solid border-gray-500 p-1 rounded-md lg:ml-9'>Go To Trade</Button>
        </div>
        <div className='mx-2'>
          <div className="my-2 h-4 relative w-full rounded-sm overflow-hidden  bg-gray-200">
            <div className=" w-full h-full z-10 absolute text-center text-[12px] leading-4">
              61%
            </div>
            <div className=" h-full absolute " style={{ width: '60%', backgroundColor: '#97f6fb' }}></div>
          </div>
        </div>
      </div>}
      <Imgs imgs={imgs} className='mt-3 mr-1' />
      <InteractiveList className='py-4' />

      <Progress value={60} className='text-black h-4 lg:w-[500px]' indicatorClass="bg-red-500">60%</Progress>
    </div>
    <div className={cn(' my-3 bg-gray-400 h-[0.7px] mr-[-0.7rem] lg:w-[600px] pl-[-5px]  ml-[-1.5rem] sm:mr-[-1.4rem]' )}></div>

  </div>
}