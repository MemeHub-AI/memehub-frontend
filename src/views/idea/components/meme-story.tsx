import { ideaApi } from '@/api/idea'
import { IdeaBasicInfo } from '@/api/idea/type'
import { fmt } from '@/utils/fmt'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

interface MemeStoryData {
  data: IdeaBasicInfo
}

export const MemeStory = ({ data }: MemeStoryData) => {
  let content =
    data?.content
      .replaceAll(/ src=/g, ' data-src1=')
      .replaceAll(/ data-src=/g, ' src=')
      .replaceAll(/(\&nbsp\;)/g, '')
      .replaceAll(/<br\s?\/?><br\s?\/?>/g, '')
      .replaceAll(/<br\/>/g, '') || ''

  console.log(content)

  const memeInfo = data?.types || {}
  const h2List = content.match(/<h2 id="[^"]*">[^<]+<\/h2>/g) || []
  const getIndex = (i: number) => content.indexOf(h2List[i]!)
  const firstContent = content.slice(getIndex(0), getIndex(1))
  const laterContent = content.slice(getIndex(1))

  return (
    <div className="flex">
      <div>
        <div className="pt-5 flex">
          <div
            className="story"
            dangerouslySetInnerHTML={{ __html: firstContent }}
          ></div>
        </div>
        <div
          className="py-5 story"
          dangerouslySetInnerHTML={{ __html: laterContent }}
        ></div>
      </div>
      <div className="ml-4 w-[200px] flex-shrink-0 sticky top-[80px] h-min">
        <div className="rounded-md bg-blue-950 text-white text-xl text-center py-1">
          Meme
        </div>
        {Object.keys(memeInfo).map((key) => {
          return (
            <div key={key}>
              {key.toLocaleLowerCase() === 'tags' ? (
                <div className="h-[1px] bg-slate-200 mt-2"></div>
              ) : (
                ''
              )}
              <div className="font-bold mt-2">
                {fmt.firstUpperCase(key || '')}
              </div>
              <div>
                {Array.isArray(memeInfo[key])
                  ? memeInfo[key].join(', ')
                  : memeInfo[key]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
