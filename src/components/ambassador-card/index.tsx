import { Card } from '../ui/card'

interface AmbassadorCardProps {
  data: {
    logo: string
    name: string
    desc: string
  }
}

export const AmbassadorCard = ({ data }: AmbassadorCardProps) => {
  return (
    <Card className="flex p-4">
      <img
        src={data.logo}
        alt="Avatar"
        className="w-[150px] h-[150px] max-sm:w-[100px] max-sm:h-[100px]"
      />
      <div className="ml-2">
        <h2 className="text-2xl">{data.name}</h2>
        <div className="mt-2 line-clamp-4">{data.desc}</div>
      </div>
    </Card>
  )
}
