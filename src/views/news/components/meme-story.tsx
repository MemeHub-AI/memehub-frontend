import { Fragment, memo } from 'react'
import { upperFirst } from 'lodash'

import { IdeaBasicInfo } from '@/api/idea/type'
import { Skeleton } from '@/components/ui/skeleton'
import { MemeMarkdown } from './meme-markdown'

interface MemeStoryData {
  data: IdeaBasicInfo
}

export const MemeStory = memo(({ data }: MemeStoryData) => {
  let content =
    data?.content
      // .replaceAll(/ src=/g, ' data-src1=')
      // .replaceAll(/ data-src=/g, ' src=')
      .replace(
        /(<img[^>]+)src="([^"]+)"([^>]+)data-src="([^"]+)"/g,
        '$1src="$4"$3data-src="$2"'
      )
      .replace(/(\&nbsp\;)/g, '')
      .replace(/<br\s?\/?><br\s?\/?>/g, '')
      .replace(/<br\/>/g, '') || ''

  const memeInfo = data?.meme || {}
  const h2List = content.match(/<h2 id="[^"]*">[^<]+<\/h2>/g) || []
  let firstContent = ''
  let laterContent = ''
  const getIndex = (i: number) => content.indexOf(h2List[i]!)

  firstContent = content.slice(getIndex(0), getIndex(1)) || content
  laterContent = content.slice(getIndex(1))

  if (!data) {
    return <Contentskeleton></Contentskeleton>
  }

  return (
    <div className="flex max-sm:flex-col">
      <div className="flex-1 max-sm:order-2">
        {/* <div
          className="pt-5 story"
          dangerouslySetInnerHTML={{ __html: firstContent }}
        ></div>
        <div
          className="my-5 story"
          dangerouslySetInnerHTML={{ __html: laterContent }}
        ></div> */}

        <MemeMarkdown className="pt-5" children={firstContent} />
        <MemeMarkdown className="my-5" children={laterContent} />
      </div>
      {data.category !== '2' ? (
        <div className="mt-5 ml-5 w-[200px] flex-shrink-0 sticky top-[80px] h-min max-sm:order-1 max-sm:static max-sm:ml-0 max-sm:w-auto">
          <div className="rounded-md bg-blue-950 text-white text-xl text-center py-1 ">
            Meme
          </div>
          <div className="max-sm:grid max-sm:grid-cols-2 max-sm:gap-2 max-sm:mt-2">
            {Object.keys(memeInfo).map((key) => {
              if (!memeInfo[key] || !memeInfo[key]?.length) {
                return <Fragment key={key} />
              }
              return (
                <div
                  key={key}
                  className="max-sm:bg-slate-100 mt-2 max-sm:mt-0 max-sm:p-2 rounded-sm"
                >
                  {key.toLocaleLowerCase() === 'tags' ? (
                    <div className="h-[1px] bg-slate-200 my-1 max-sm:hidden"></div>
                  ) : (
                    ''
                  )}
                  <div className="font-bold">{upperFirst(key)}</div>
                  <div className="break-all">
                    {Array.isArray(memeInfo[key])
                      ? memeInfo[key].join(', ')
                      : memeInfo[key].replace(/[{}]/g, '')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
})

const Contentskeleton = () => {
  return (
    <div>
      <div className="w-full my-2 flex flex-col gap-2 mr-2">
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-[70%] h-3" />
        <Skeleton className="w-1/2 h-4" />
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-[70%] h-3" />
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-full h-5 rounded-full mt-2" />
      </div>
      <Skeleton className="w-8 h-8 absolute right-2 top-2" />
    </div>
  )
}
