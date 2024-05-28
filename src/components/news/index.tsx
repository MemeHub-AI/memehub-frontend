import { useTranslation } from 'react-i18next'

import { NewsData } from '@/api/news/types'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  news: NewsData
  onMeme: () => any
}

export const NewsCard = ({ news, onMeme }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex gap-2 transition-all p-2',
        'border-2 border-black rounded-lg hover:bg-zinc-100'
      )}
    >
      <img
        src={news.image.imageUrl}
        alt="logo"
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex flex-col justify-between items-start">
        <a
          className="font-bold text-sm hover:text-blue-600"
          href={news.title.exploreLink}
          target="_blank"
        >
          {news?.title.query}
        </a>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-black"
          shadow="none"
          onClick={onMeme}
        >
          {t('meme.it')}
        </Button>
      </div>
    </div>
  )
}
