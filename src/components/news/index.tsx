import { useTranslation } from 'react-i18next'

import { MemeInfoDialogData } from '@/api/news/types'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  news: MemeInfoDialogData
  onMeme: () => any
  onClick?: () => any
}

export const NewsCard = ({ news, onMeme, onClick }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex gap-2 transition-all p-2 cursor-pointer',
        'border-2 border-black rounded-lg hover:bg-zinc-100'
      )}
      onClick={onClick}
    >
      <img
        src={news.image}
        alt="logo"
        className="w-[100px] h-[100px] flex-shrink-0 object-cover rounded"
      />
      <div className="flex-1 overflow-hidden flex flex-col justify-between items-start">
        <div
          className={clsx(
            'font-bold leading-4 text-sm ',
            news.title.length < 12 ? 'w-[80%] truncate block' : 'line-clamp-4'
          )}
        >
          {news?.title}
        </div>
        {news.title.length < 31 ? (
          <p
            className={clsx(
              'text-sm leading-4 text-gray-500',
              news.title.length <= 12 ? 'line-clamp-2' : 'truncate w-[99%]'
            )}
          >
            {news?.content}
          </p>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-black"
          shadow="none"
          onClick={(e) => {
            e.stopPropagation()
            onMeme()
          }}
        >
          {t('meme.it')}
        </Button>
      </div>
    </div>
  )
}
