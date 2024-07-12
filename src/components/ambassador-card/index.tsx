import { defaultImg } from '@/config/link'
import { Card } from '../ui/card'
import { Img } from '../img'
import { URL_TYPE, utilsUrl } from '@/utils/url'
import { utilLang } from '@/utils/lang'

interface AmbassadorCardProps {
  data?: {
    logo: string
    name: string
    description: string
    twitter_url?: string
    telegram_url?: string
  }
}

export const AmbassadorCard = ({ data }: AmbassadorCardProps) => {
  return (
    <Card
      className="flex p-4 hover:scale-102 gap-2"
      shadow={'none'}
      onClick={() => {
        if (!data?.twitter_url && !data?.telegram_url) return
        open(
          utilsUrl.mediaUrl(data?.twitter_url, URL_TYPE.TWITTER) ||
            utilsUrl.mediaUrl(data?.telegram_url, URL_TYPE.TELEGRAM)
        )
      }}
    >
      <Img
        src={data?.logo || defaultImg}
        alt="Avatar"
        className="w-24 h-24 shrink-0 xl:w-32 xl:h-32 rounded-full border-2 border-black"
      />
      <div className="ml-2">
        <h2
          className="text-2xl max-sm:text-xl break-all line-clamp-2"
          title={utilLang.getContent(data?.name)}
        >
          {utilLang.getContent(data?.name)}
        </h2>
        <div
          className="mt-2 break-all line-clamp-2"
          title={utilLang.getContent(data?.description)}
        >
          {utilLang.getContent(data?.description)}
        </div>
      </div>
    </Card>
  )
}
