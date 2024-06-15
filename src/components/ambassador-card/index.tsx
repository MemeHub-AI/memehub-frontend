import { defaultImg } from '@/config/link'
import { Card } from '../ui/card'

interface AmbassadorCardProps {
  data?: {
    logo: string
    name: string
    description: string
  }
}

export const AmbassadorCard = ({ data }: AmbassadorCardProps) => {
  return (
    <Card className="flex p-4 hover:scale-105" shadow={'none'}>
      <img
        src={data?.logo || defaultImg}
        alt="Avatar"
        className="w-[150px] h-[150px] max-xl:w-[120px] max-xl:h-[120px] max-sm:w-[100px] max-sm:h-[100px]"
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
