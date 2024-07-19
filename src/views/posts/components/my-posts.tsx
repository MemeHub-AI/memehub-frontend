import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { InteractiveList } from './ui/interactive-list'
import { RiEdit2Fill } from 'react-icons/ri'
import { FaBoltLightning } from 'react-icons/fa6'
import Imgs from './ui/imgs'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { IoAlertCircleOutline } from 'react-icons/io5'
import { Posts } from '../type'
import { TokenBlock } from './ui/token-block'
import { DialogClose } from '@radix-ui/react-dialog'

interface PostsPro {
  postObj: Posts
}

export const MyPosts = ({ postObj }: PostsPro) => {
  const posts = postObj.data
  const { t } = useTranslation()
  const imgs = [
    '/favicon.ico',
    '/images/ai.jpg',
    '/images/ai.jpg',
    '/images/ai.jpg',
  ]

  return (
    <div>
      {posts.map((p, i) => (
        <div className={cn('flex flex-col py-1')}>
          <div className="flex items-center">
            <div className="shrink-0">
              <Image
                className="inline-block h-10 w-10 rounƒded-full ml-1"
                src="/favicon.ico"
                alt=""
                width={50}
                height={50}
              />
            </div>
            <div className="ml-3 flex justify-between w-full lg:w-[500px] items-center">
              <div>
                <p className="text-base font-medium text-black ">
                  Sonali Hiraveee
                  <span className="text-sm leading-10 font-medium text-gray-500 group-hover:text-gray-300 transition ease-in-out duration-150 pl-3">
                    20分钟
                  </span>
                </p>
              </div>

              {p.isLaunched ? (
                p.isDetailed && (
                  <span className="bg-purple-500 rounded-md p-1 text-white  font-bold">
                    {t('started')}
                  </span>
                )
              ) : (
                <span className="text-sm font-medium text-green-500 lg:ml-[155px]">
                  20H:20M
                </span>
              )}
            </div>
          </div>
          <div className="ml-14 flex gap-2 ">
            {/* 只有未补充代币详情才会有编辑代币详情按钮，如果发射可以查看代币详情但是无法编辑 */}
            {(!p.isLaunched || !p.isDetailed) && (
              <button className="border border-solid border-black px-2 rounded-md">
                {t('edit')}
              </button>
            )}
            {(p.isLaunched || !p.isDetailed) && (
              <Button className=" bg-yellow-200 rounded-md h-8 gap-1">
                {!p.isDetailed && <RiEdit2Fill />}
                {t('token.detail')}
              </Button>
            )}
          </div>
          {/* 先判断是否为未补充代币详情状态，在判断代币是否已经筹集结束，如果是的话显示已完成筹集尽快补充，如果不是显示尽快补充*/}
          {!p.isDetailed &&
            (p.isLaunched ? (
              <div className="ml-14 relative border border-solid border-yellow-600 text-yellow-500 rounded-md py-1 mt-2 lg:w-[500px]">
                <FaBoltLightning className="m-1 absolute text-yellow-600 " />
                <span className="absolute right-0 mr-1 text-green-400">
                  59m:23s
                </span>
                <div className="pl-6 w-[88%]">{t('hundred.like')}</div>
                <div className="pl-6 w-[88%]">{t('add.launch')}</div>
                <div className="pl-6 w-[88%]">{t('idea.fail')}</div>
              </div>
            ) : (
              <div className="ml-14 relative border border-solid border-yellow-600 text-yellow-500 rounded-md py-1 mt-2 lg:w-[500px]">
                <IoAlertCircleOutline className="mx-2 mt-1 absolute text-yellow-600 " />
                <div className="pl-7 w-[88%]">{t('add.details')}</div>
              </div>
            ))}

          <div className="pl-14 mt-2">
            <p className="text-base width-auto font-medium text-black flex-shrink lg:w-[500px]">
              Day 07 of the challenge I was wondering what I can do with , so
              just started building Twitter UI using Tailwind and so far it
              looks so promising. I will post my code after completion. [07/100]
            </p>
            {/* 判断已发射或者补全信息就可以显示 */}
            {(!p.isLaunched || p.isDetailed) && (
              <TokenBlock type={postObj.type} />
            )}
            <Imgs imgs={imgs} className="mt-3 mr-1" />
            <InteractiveList className="py-1" />
            <Progress
              value={60}
              className="mb-3 text-black h-4 lg:w-[500px] rounded-sm border border-black border-solid "
              indicatorClass="bg-red-500"
            >
              <span className="text-white">60%</span>
            </Progress>
          </div>
          {i !== posts.length - 1 && (
            <div
              className={cn(
                '  bg-gray-400 h-[0.7px] mr-[-0.7rem] lg:w-[600px] pl-[-5px]  ml-[-1.5rem] sm:mr-[-1.4rem]'
              )}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}
