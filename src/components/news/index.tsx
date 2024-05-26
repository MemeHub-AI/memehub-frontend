import { NewsData } from '@/api/news/types'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  news: NewsData
  onMeme: () => any
}

export const NewsCard = ({ news, onMeme }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 transition-all cursor-pointer p-2 bg-slate-50 rounded-sm hover:bg-slate-100">
      <img
        src={news.image.imageUrl}
        alt="logo"
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex flex-col justify-between items-start">
        <p
          className="font-bold text-sm flex-1 mb-2 hover:text-blue-600"
          onClick={() => open(news.title.exploreLink)}
        >
          {news?.title.query}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-black"
          onClick={onMeme}
        >
          {t('meme.it')}
        </Button>
      </div>
    </div>
  )
}
