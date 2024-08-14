import React, { ComponentProps } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Props
  extends Omit<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'> {
  images: string[]
  value: number
  onChange: (index: number) => void
  controllable?: boolean
  disabled?: boolean
}

export const ImagesPreviewDialog = ({
  images,
  value,
  onChange,
  controllable = true,
  disabled,
}: Props) => {
  const isSingle = images.length === 1

  return (
    <Dialog
      open={!disabled && value >= 0}
      onOpenChange={(open) => !open && onChange?.(-1)}
      contentProps={{
        closeClass: 'top-1 right-1',
        className: 'p-0 gap-2 border-none',
      }}
    >
      {controllable && !isSingle && (
        <>
          <Button
            shadow="none"
            variant="circle"
            size="icon-sm"
            className="absolute left-1 top-1/2 -translate-y-1/2"
            disabled={disabled}
            onClick={() => onChange?.(Math.max(value - 1, 0))}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            shadow="none"
            variant="circle"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            disabled={disabled}
            onClick={() => onChange?.(Math.min(value + 1, images.length - 1))}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </>
      )}
      <img
        src={images[value]}
        alt="picture"
        className="w-full h-full object-cover rounded-lg border"
      />
      <div className="flex items-center space-x-2 absolute bottom-2 left-1/2 -translate-x-1/2">
        {images.map((p, i) => (
          <span
            key={i}
            className={cn(
              'w-3 h-3 rounded-full bg-zinc-500',
              p === images[value] && 'bg-black'
            )}
            onClick={() => {
              if (disabled) return
              if (controllable && !isSingle) onChange?.(i)
            }}
          ></span>
        ))}
      </div>
    </Dialog>
  )
}

export default ImagesPreviewDialog
