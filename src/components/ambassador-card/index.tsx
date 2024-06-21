import { defaultImg } from '@/config/link'
import { Card } from '../ui/card'
import { Img } from '../img'

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
        open(data?.twitter_url || data?.telegram_url)
      }}
    >
      <Img
        src={data?.logo || defaultImg}
        alt="Avatar"
        className="w-24 h-24 xl:w-32 xl:h-32  rounded-full border-2 border-black"
      />
      <div className="ml-2">
        <h2 className="text-2xl max-sm:text-xl">{data?.name}</h2>
        <div className="mt-2 line-clamp-4 max-sm:line-clamp-3">
          {data?.description}
        </div>
      </div>
    </Card>
  )
}
