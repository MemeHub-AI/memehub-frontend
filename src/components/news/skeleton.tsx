import { Skeleton } from '../ui/skeleton'

export const NewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-260px)] overflow-y-auto max-md:h-[unset] max-md:gap-4 max-md:overflow-y-clip pr-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-2 w-full border-2 rounded-lg p-2">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <div className="flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
