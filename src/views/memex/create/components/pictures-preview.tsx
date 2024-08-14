import React, { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { ImagesPreviewDialog } from '@/components/images-preview-dialog'
import { useCreatePostContext } from '@/contexts/memex/create-post'

export const PicturesPreview = () => {
  const [srcIdx, setSrcIdx] = useState(-1)
  const { form } = useCreatePostContext()
  const pictures = form.watch('pictures')

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${Math.min(
          pictures.length,
          2
        )}, minmax(0, 1fr))`,
      }}
    >
      <ImagesPreviewDialog
        images={pictures}
        value={srcIdx}
        onChange={setSrcIdx}
      />
      {pictures.map((src, i) => (
        <div className="w-full h-full max-h-64 relative">
          <img
            src={src}
            alt="picture"
            className="w-full h-full object-cover rounded-lg border"
            onClick={() => setSrcIdx(i)}
          />
          <Button
            shadow="none"
            variant="circle"
            size="icon-sm2"
            className="absolute top-2 right-2"
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
