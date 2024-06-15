import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiStars } from 'react-icons/wi'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { useQuery } from '@tanstack/react-query'
import { ideaApi } from '@/api/idea'
import { newsApi } from '@/api/news'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'

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

  const { data: result } = useQuery({
    queryKey: ['getTrendingIdeas'],
    queryFn: () => {
      return newsApi.getOpportunity({ page: 1, page_size: 10 })
    },
  })

  const data = result?.data

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
        'mt-8  bg-slate-100 rounded-sm py-5 my-5 max-md:w-full max-md:py-3  max-md:mt-2',
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
        <div className="flex items-center max-md:mt-4">
          <Input
            placeholder={t('input.you.idea')}
            className="max-w-[180px] ml-4 max-md:ml-0 items-stretch"
            onChange={({ target }) => setValue(target.value)}
            endIcon={
              <Tooltip tip={t('random.meme')}>
                <div
                  className="bg-black text-white flex items-center px-1.5 cursor-pointer"
                  onClick={onRandomGen}
                >
                  <WiStars size={26} />
                </div>
              </Tooltip>
            }
          />
          <Button onClick={onGen} className="ml-5">
            {t('ai.generate')}
          </Button>
        </div>
      </div>
    </div>
  )
}
