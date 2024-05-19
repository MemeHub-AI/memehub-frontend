import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { Title } from './title'
import { newsApi } from '@/api/news'

export const InspirationNews = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()

  const { data: result, isLoading } = useQuery({
    queryKey: [newsApi.getNews.name],
    queryFn: async () => {
      const data = await newsApi.getNews()
      const parsed = data.map((d) => {
        if (typeof d.articles === 'string') {
          d.articles = JSON.parse(d.articles)
        }
        return d
      })

      return parsed
    },
  })

  if (isLoading) {
    return <div className="mt-6">{t('loading')}</div>
  }

  return (
    <div className={className}>
      <Title className="whitespace-nowrap">
        {t('create.inspiration.title')}
      </Title>
      <div className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip">
        {result?.map((item, i) => {
          return (
            <div
              key={i}
              className="flex rounded-2xl cursor-pointer"
              onClick={() => open(item.articles[0]?.image?.newsUrl)}
            >
              <div className="relative rounded-b-lg min-w-[90px] min-h-[90px]  overflow-hidden">
                <img
                  src={item.articles[0]?.image?.imageUrl}
                  className="w-[90px] h-[90px] rounded-lg cursor-pointer"
                  alt=""
                />
              </div>
              <div className="py-0 pr-2 ml-3 flex flex-col justify-between">
                <h1 className="text-2xl  cursor-pointer hover:text-gray-500 max-sm:text-xl leading-none">
                  {item.title?.query}
                </h1>
                <div className="max-sm:mt-1 max-md:max-w-[65vw] line-clamp-2 text-zinc-500">
                  {item.articles[0]?.title}
                </div>
                {/* <div className=" text-gray-500 max-sm:mt-2 leading-none">
                  {dayjs(item.articles[0].timestamp * 1000).fromNow()}
                </div> */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
