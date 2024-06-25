import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiStars } from 'react-icons/wi'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { useQuery } from '@tanstack/react-query'
import { newsApi } from '@/api/news'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUserStore } from '@/stores/use-user-store'

interface Props {
  className?: string
  onInputGen: (value: string) => void
  onRandomGen: () => void
}

export const AIIdeaBar = (props: Props) => {
  const { className, onInputGen, onRandomGen } = props
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { push } = useRouter()

  const userStore = useUserStore()
  const { setConnectOpen } = useWalletStore()

  const { data: result } = useQuery({
    queryKey: ['getTrendingIdeas'],
    queryFn: () => {
      return newsApi.getOpportunity({ page: 1, page_size: 4 })
    },
  })

  const data = result?.data

  const onRandom = () => {
    if (userStore.userInfo?.id == null) {
      return setConnectOpen(true)
    }

    onRandomGen()
  }

  const onGen = () => {
    if (value.trim() === '') {
      toast.error(t('input.you.idea'))
      return
    }
    onInputGen(value)
  }

  return (
    <div
      className={clsx(
        'mt-8  bg-slate-100 rounded-sm py-5 pb-4 my-5 max-md:w-full max-md:py-3  max-md:mt-2',
        className
      )}
    >
      <div className="flex items-center px-7 max-md:px-3 max-md:flex-col max-md:items-start">
        <div className="flex items-center">
          <img
            src="/images/ai.png"
            alt="img"
            className="w-[60px] h-[60px] rounded-sm mr-5"
          />
          <div>{t('ai.generate.bio')}</div>
        </div>
        <div className="flex items-stretch max-md:mt-4">
          <Input
            placeholder={t('input.you.idea')}
            className="max-w-[180px] ml-4 max-md:ml-0 items-stretch"
            onChange={({ target }) => setValue(target.value)}
            endIcon={
              <TooltipProvider>
                <Tooltip className="block h-full" tip={t('random.meme')}>
                  <TooltipTrigger className="block h-full">
                    <div
                      className="bg-black h-full text-white flex items-center px-1.5 cursor-pointer"
                      onClick={onRandom}
                    >
                      <WiStars size={26} />
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            }
          />
          <Button onClick={onGen} className="ml-5">
            {t('ai.generate')}
          </Button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#e2e2e2] my-4 max-sm:hidden"></div>
      <div className="flex justify-start px-7 max-md:px-3 max-md:flex-col max-md:items-start max-sm:mt-4">
        <div className="flex-shrink-0">{t('trending.idea')}</div>
        <div className="flex flex-wrap max-sm:grid grid-cols-6 gap-6 ml-5 max-2xl:grid-cols-4 max-xl:grid-cols-2 max-md:ml-0 max-md:mt-2 max-sm:gap-3">
          {data?.results?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center cursor-pointer"
                onClick={() => {
                  push(`${Routes.Idea}/${item.id}?type=2`)
                }}
              >
                <img
                  src={item.image}
                  alt="Logo"
                  className="w-[30px] h-[30px] rounded-full object-cover max-sm:w-[25px] max-sm:h-[25px]"
                />
                <span className="ml-2 text-blue-700 truncate">
                  {item.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
