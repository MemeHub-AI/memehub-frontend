import { ComponentProps, ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'
import { LetterCaseUppercaseIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
} from '@radix-ui/react-dialog'

interface ImgsProps extends ComponentProps<'div'> {
  imgs: string[]
}

const Imgs = ({ className, imgs }: ImgsProps) => {
  const [detail, setDetail] = useState<ReactNode>(null)

  const showImg = (i: number) => {
    setDetail(<img src={imgs[i]} className="w-full object-cover z-10s"></img>)
  }

  return (
    <div
      className={cn(
        imgs.length > 1 && 'grid grid-cols-2',
        ' rounded-2xl overflow-hidden lg:w-[500px] gap-1 h-[300px]',
        className
      )}
    >
      <Dialog
        open={!!detail}
        onOpenChange={() => {
          setDetail(null)
        }}
        contentProps={{ className: 'p-0 breake-all', showClose: false }}
      >
        {detail}
      </Dialog>
      {imgs.map((image, index) => (
        <img
          src={image}
          alt={`Image ${index + 1}`}
          className={cn('w-full object-cover h-[150px]')}
          onClick={() => {
            showImg(index)
          }}
        />
      ))}
    </div>
  )
}

export default React.memo(Imgs)
