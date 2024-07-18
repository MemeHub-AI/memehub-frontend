import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { InteractiveList } from './ui/interactive-list';
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Imgs from './ui/imgs';
import { useTranslation } from 'react-i18next';
import { TokenBlock } from './ui/token-block';
import { Posts } from '../type';
interface postsPro {
  postObj: Posts
}

export const OrtherPosts = ({ postObj }: postsPro) => {
  const posts = postObj.data
  const { t } = useTranslation()
  const imgs = ['/images/ai.jpg', '/images/ai.jpg', '/favicon.ico', '/images/ai.jpg']
  return <div>
      {posts.map((p,i)=>(
    <div className={cn('py-1')}>
      <div className="flex items-center ">
        <div className='shrink-0'>
          <img className="inline-block h-10 w-10 rounƒded-full ml-1" src="/favicon.ico" alt="" />
        </div>
        <div className="ml-3 flex max-lg:justify-between w-full items-center">
          <div>
            <p className="text-base leading-6 font-medium text-black ">
              Sonali Hiraveee
              <span className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-300 transition ease-in-out duration-150 pl-3">
                20分钟
              </span>
            </p>
          </div>
          {p.isLaunched ?
            <div className='bg-purple-500 rounded-md p-1 text-white lg:ml-[155px]'>
              🚀  {t('succeed')}
            </div> :
            <span className="text-sm font-medium text-green-500 lg:ml-[155px]">
              20H:20M
            </span>
          }
        </div>
      </div>
      {p.isLaunched && <Button className=' bg-yellow-200 rounded-md h-8 gap-1 ml-14 mb-2'><PiPencilSimpleLineThin />{p.isAirdrop ? t('token.detail') : t('Claim') + ` 0.1% $PEPE`}</Button>}
      <div className="pl-14 ">
        <p className="text-base width-auto font-medium text-black flex-shrink lg:w-[500px]" >
          Day 07 of the challenge
          I was wondering what I can do with , so just started building
          Twitter UI using Tailwind and so far it looks so promising. I will post my code after completion.
          [07/100]
        </p>
        {/* 判断这个币时候已经发射 */}
        {p.isLaunched && <TokenBlock type={postObj.type} />}
        <Imgs imgs={imgs} className='mt-3 mr-1' />
        <InteractiveList className='py-1'/>
        <Progress value={60} className='text-black h-4 lg:w-[500px] rounded-sm mb-4' indicatorClass="bg-red-500">60%</Progress>
      </div>
      {i !== posts.length - 1 &&<div className={cn('mt-3 bg-gray-400 h-[0.7px] mr-[-0.7rem] lg:w-[600px] pl-[-5px]  ml-[-1.5rem] sm:mr-[-1.4rem]')}></div>}

    </div>
    ))}
  </div>
}