import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ComponentProps } from 'react'
import { Title } from './title'

// import { Header } from './header'

export const InspirationNews = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()

  // const { data: result, isLoading } = useQuery({
  //   queryKey: [newsApi.getNews.name],
  //   queryFn: () => newsApi.getNews(),
  // })

  const isLoading = false
  const result = {
    data: [
      {
        title: {
          query: 'title',
        },
        articles: [
          {
            title: 'title',
            image: {
              imageUrl: 'https://picsum.photos/200/300',
              newsUrl: 'https://picsum.photos/200/300',
            },
            timestamp: 1678901234567890,
          },
        ],
      },
      {
        title: {
          query: 'title',
        },
        articles: [
          {
            title: 'title',
            image: {
              imageUrl: 'https://picsum.photos/200/300',
              newsUrl: 'https://picsum.photos/200/300',
            },
            timestamp: 1678901234567890,
          },
        ],
      },
    ],
  }

  if (isLoading) {
    return <div>{t('loading')}</div>
  }

  return (
    <div className={className}>
      <Title className="whitespace-nowrap">
        {t('create.inspiration.title')}
      </Title>
      <div className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip">
        {result?.data?.map((item, i) => {
          return (
            <div
              key={i}
              className="flex rounded-2xl cursor-pointer"
              onClick={() => open(item.articles[0].image.newsUrl)}
            >
              <div className="relative rounded-b-2xl min-w-[90px] min-h-[90px]  overflow-hidden">
                <img
                  src={item.articles[0].image.imageUrl}
                  className="w-[90px] h-[90px] rounded-2xl cursor-pointer"
                  alt=""
                />
              </div>
              <div className="py-2 pr-2 ml-3 flex flex-col justify-between ">
                <h1 className="text-2xl  cursor-pointer hover:text-gray-500 max-sm:text-xl leading-none">
                  {item.title.query}
                </h1>
                <div className="truncate max-w-[calc(30vw-150px)]  max-sm:mt-1 max-md:max-w-[65vw]">
                  {item.articles[0].title}
                </div>
                <div className=" text-gray-500 max-sm:mt-2 leading-none">
                  {dayjs(item.articles[0].timestamp * 1000).fromNow()}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
