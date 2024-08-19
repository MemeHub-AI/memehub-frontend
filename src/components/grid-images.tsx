import React, { useState, type ComponentProps } from 'react'
import { isEmpty } from 'lodash'

import { cn } from '@/lib/utils'
import { ImagesPreviewDialog } from './images-preview-dialog'
import { PhotoProvider, PhotoView } from 'react-photo-view'

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
  const [index, setIndex] = useState(-1)

  if (isEmpty(urls)) return

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-1 rounded-md overflow-hidden mt-2',
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
      {/* <ImagesPreviewDialog images={urls} value={index} onChange={setIndex} /> */}

      <PhotoProvider>
        <div className="foo">
          {urls.map((src, i) => (
            <PhotoView key={i} src={src}>
              <img
                src={src}
                alt=""
                className={cn(
                  'w-full h-full max-sm:max-h-48 object-cover lg:max-h-100 lg: max-w-128',
                  imgClass
                )}
              />
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
      {/* {urls.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="poster"
          className={cn(
            'w-full h-full max-sm:max-h-48 object-cover lg:max-h-100 lg: max-w-128',
            imgClass
          )}
          onClick={() => previewable && setIndex(i)}
        />
      ))} */}
    </div>
  )
}

export default GridImages
