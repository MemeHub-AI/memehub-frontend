import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export const IdeaDetailsSkeleton = () => {
  return (
    <div className="pt-3">
      <div className="px-3 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-10 h-6" />
          <Skeleton className="w-20 h-6" />
        </div>

        <ProfileSkeleton />

        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-4" />
          <GridImagesSkeleton />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-10 h-5" />
            <Skeleton className="w-10 h-5" />
          </div>
          <Skeleton className="w-20 h-5" />
        </div>

        <Skeleton className="w-full h-5" />
      </div>

      <Separator className="my-3" />

      <div className="px-3">
        <div className="flex space-x-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-1/2 h-4" />
            <div className="flex space-x-2">
              <Skeleton className="w-20 h-8 rounded-full" />
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  )
}

const ProfileSkeleton = () => (
  <div className="flex space-x-2 relative">
    <Skeleton className="w-12 h-12" />
    <Skeleton className="w-16 h-4 absolute top-0 right-0" />
    <div className="flex flex-col justify-between">
      <Skeleton className="w-28 h-4" />
      <Skeleton className="w-20 h-4" />
    </div>
  </div>
)

const CommentSkeleton = () => (
  <div className="flex space-x-2 border-b py-3 px-3">
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="w-28 h-4 mt-1" />
      <Skeleton className="w-full h-4 !mt-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex space-x-1">
        <Skeleton className="w-full h-28" />
        <Skeleton className="w-full h-28" />
      </div>
    </div>
  </div>
)

const GridImagesSkeleton = () => (
  <div className="grid grid-cols-2 gap-2">
    <Skeleton className="w-full h-28" />
    <Skeleton className="w-full h-28" />
    <Skeleton className="w-full h-28" />
    <Skeleton className="w-full h-28" />
  </div>
)

export default IdeaDetailsSkeleton
