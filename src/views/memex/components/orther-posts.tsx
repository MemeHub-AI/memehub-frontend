import React from 'react'
import { RiEdit2Fill } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { InteractiveList } from './ui/interactive-list'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Imgs } from './ui/imgs'
import { TokenBlock } from './ui/token-block'

export const OrtherPosts = () => {
  const { t } = useTranslation()
  const imgs = [
    '/images/404.png',
    '/images/burn.png',
    '/favicon.ico',
    '/images/cat.jpg',
  ]
  const posts = [
    {
      isLaunched: true,
      isAirdrop: true,
    },
    {
      isLaunched: true,
      isAirdrop: false,
    },
    {
      isLaunched: false,
      isAirdrop: false,
    },
  ]
  const type = 1

  return (
    <div>
      {posts.map((p, i) => (
        <div className={cn('py-1')}>
          <div className="flex items-center ">
            <div className="shrink-0">
              <img
                className="inline-block h-10 w-10 rounƒded-full"
                src="/favicon.ico"
                alt=""
              />
            </div>
            <div className="ml-3 flex justify-between w-full items-center lg:w-[500px]">
              <div>
                <p className="text-base leading-6 font-medium text-black ">
                  Sonali Hiraveee
                  <span className="text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-300 transition ease-in-out duration-150 pl-3">
                    20m
                  </span>
                </p>
              </div>
              {p.isLaunched ? (
                <div className="bg-purple-500 rounded-md p-1 text-white text-sm font-medium">
                  🚀 {t('succeed')}
                </div>
              ) : (
                <span className="text-sm font-medium text-green-700 lg:ml-[155px]">
                  20H:20M
                </span>
              )}
            </div>
          </div>
          {p.isLaunched && (
            <Button className=" bg-yellow-200 rounded-md h-8 ml-14 mb-2 gap-1 px-2 font-normal">
              {p.isAirdrop ? (
                <div className="flex gap-1 items-center">
                  <RiEdit2Fill />
                  {t('token.detail')}
                </div>
              ) : (
                t('Claim') + ` 0.1% $PEPE`
              )}
            </Button>
          )}
          <div className="pl-14 ">
            <p className="text-base width-auto  text-black flex-shrink lg:w-[500px]">
              Day 07 of the challenge I was wondering what I can do with , so
              just started building Twitter UI using Tailwind and so far it
              looks so promising. I will post my code after completion. [07/100]
            </p>
            {p.isLaunched && <TokenBlock type={type} />}
            <Imgs imgs={imgs} className="mt-3 mr-1" />
            <InteractiveList className="py-1" />
            <Progress
              value={60}
              className="text-black h-5 lg:w-[500px] rounded-sm mb-4 border border-solid border-black"
              indicatorClass="bg-red-500"
            >
              60%
            </Progress>
          </div>
          {i !== posts.length - 1 && (
            <div
              className={cn(
                'mt-3 bg-gray-400 h-[0.7px] mr-[-0.7rem] lg:w-[600px] pl-[-5px]  ml-[-1.5rem] sm:mr-[-1.4rem]'
              )}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}
