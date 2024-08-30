import React, { type ComponentProps } from 'react'
import { isEmpty } from 'lodash'
import { PhotoProvider, PhotoView } from 'react-photo-view'

import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'div'> {
  urls?: string[]
  maxCols?: number
  imgClass?: string
  previewable?: boolean
}

export const GridImages = ({
  urls = [],
  maxCols = 2,
  className,
  imgClass,
  previewable = true,
  ...props
}: Props) => {
  if (isEmpty(urls)) return

  return (
    <PhotoProvider>
      <div
        className={cn(
          'grid grid-cols-1 gap-1 rounded-2xl border overflow-hidden mt-2',
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${Math.min(
            urls.length,
            maxCols
          )}, minmax(0, 1fr))`,
        }}
        {...props}
      >
        {urls.map((src, i) => (
          <PhotoView key={i} src={src}>
            <img
              src={src}
              alt="img"
              className={cn(
                'w-full h-full max-h-48 object-cover lg:max-h-100',
                imgClass
              )}
            />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  )
}

export default GridImages
