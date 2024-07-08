import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { MemeInfoDialogData } from '@/api/news/types'
import { cn } from '@/lib/utils'
import { Img } from '../img'
import { fmt } from '@/utils/fmt'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  news: MemeInfoDialogData
  onClick?: () => any
}

export const NewsCard = ({ news, onClick }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex space-x-3 transition-all p-2 cursor-pointer',
        'rounded-md hover:bg-zinc-100'
      )}
      onClick={onClick}
    >
      <Img
        src={news.image}
        alt="logo"
        className="w-[100px] h-[100px] flex-shrink-0 object-cover rounded"
      />
      <div className="flex-1 overflow-hidden flex flex-col items-start">
        <div
          className={clsx(
            'font-bold text-sm ',
            news.title?.length < 12 ? 'w-[80%] truncate block' : 'line-clamp-5'
          )}
        >
          {news?.title}
        </div>
        {news.title?.length < 46 ? (
          <p
            className={clsx(
              'mt-5 text-sm leading-4 text-gray-500 ',
              news.title?.length < 22
                ? 'line-clamp-4'
                : news.title?.length < 18
                ? 'line-clamp-3'
                : 'line-clamp-2'
            )}
          >
            {fmt.replaceHTMLCode(news?.content?.replace(/n/g, ''))}
          </p>
        ) : null}
      </div>
    </div>
  )
}
