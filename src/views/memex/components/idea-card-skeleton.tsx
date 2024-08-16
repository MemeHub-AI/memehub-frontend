import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export const IdeaCardSkeleton = ({ length = 3 }: { length?: number }) => {
  return Array.from({ length }).map((_, i) => (
    <div key={i} className="px-3 py-2 flex space-x-2 border-b-2">
      <Skeleton className="w-10 h-10 rounded-full" />

      <div className="space-y-3 flex-1">
        <div className="flex flex-col justify-between">
          <div className="flex space-x-2 items-center">
            <Skeleton className="w-12 h-4" />
            <span className="mx-1 text-zinc-300">·</span>
            <Skeleton className="w-10 h-3" />
          </div>
          <Skeleton className="w-20 h-3" />
        </div>

        <div className="space-y-1">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
        </div>

        <div className="grid grid-cols-2 h-48 gap-2">
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-16 h-4" />
        </div>

        <Skeleton className="w-full h-5" />
      </div>
    </div>
  ))
}

export default IdeaCardSkeleton
