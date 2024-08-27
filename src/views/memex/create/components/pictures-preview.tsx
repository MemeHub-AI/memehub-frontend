import React, { ComponentProps, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { ImagesPreviewDialog } from '@/components/images-preview-dialog'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { cn } from '@/lib/utils'

// TODO: refactor to public comp
export const PicturesPreview = ({
  disabled,
  className,
  ...props
}: ComponentProps<'div'> & { disabled?: boolean }) => {
  const [srcIdx, setSrcIdx] = useState(-1)
  const { form } = useCreateIdeaContext()
  const pictures = form.watch('pictures')

  return (
    <div
      className={cn('grid max-2xl:gap-2', disabled && 'opacity-50', className)}
      style={{
        gridTemplateColumns: `repeat(${Math.min(
          pictures.length,
          2
        )}, minmax(0, 1fr))`,
      }}
      {...props}
    >
      <ImagesPreviewDialog
        images={pictures}
        value={srcIdx}
        onChange={setSrcIdx}
        disabled={disabled}
      />
      {pictures.map((src, i) => (
        <div key={i} className="w-full h-full max-h-48 relative md:max-w-80">
          <img
            src={src}
            alt="picture"
            className="w-full h-full object-cover rounded-lg border"
            onClick={() => setSrcIdx(i)}
          />
          <Button
            type="button"
            shadow="none"
            variant="circle"
            size="icon-sm2"
            className="absolute top-2 right-2"
            disabled={disabled}
            onClick={() => {
              form.setValue(
                'pictures',
                pictures.filter((p) => p !== src)
              )
              form.trigger('pictures')
            }}
          >
            <Cross2Icon className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default PicturesPreview
