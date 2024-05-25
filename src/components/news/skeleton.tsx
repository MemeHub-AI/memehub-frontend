import { Skeleton } from '../ui/skeleton'

export const NewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-2 w-full">
          <Skeleton className="h-[90px] w-[90px] rounded-lg" />
          <div className="flex flex-col justify-between flex-1">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
