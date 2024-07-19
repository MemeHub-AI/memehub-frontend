import React, { ComponentProps, useState } from 'react'
import { isEmpty, isNumber } from 'lodash'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

import { Img } from './img'
import { cn } from '@/lib/utils'
import { Dialog } from './ui/dialog'
import { Button } from './ui/button'

interface Props extends ComponentProps<'div'> {
  poster?: string[]
}

export const PosterImages = ({ poster = [], className }: Props) => {
  const { t } = useTranslation()
  const [active, setActive] = useState<number>()

  if (isEmpty(poster)) return

  return (
    <div
      className={cn('flex items-center justify-between space-x-2', className)}
    >
      <Dialog
        open={isNumber(active)}
        onOpenChange={() => setActive(undefined)}
        contentProps={{
          className: 'flex-col justify-center items-center ',
        }}
      >
        <FaChevronLeft
          className="absolute top-1/2 left-2 cursor-pointer"
          size={20}
          onClick={() => setActive((a) => (a! > 0 ? --a! : a))}
        />
        <FaChevronRight
          className="absolute top-1/2 right-2 cursor-pointer"
          size={20}
          onClick={() => setActive((a) => (a! < poster.length - 1 ? ++a! : a))}
        />
        <Img
          src={poster[active!]}
          alt="poster"
          className="object-cover select-none"
        />

        <div className="flex justify-center items-center space-x-2">
          {poster.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3 h-3 rounded-full bg-zinc-400',
                active === i && 'bg-black'
              )}
            ></div>
          ))}
        </div>

        <Button onClick={() => open(poster[active!].replace('mini', 'origin'))}>
          {t('download')}
        </Button>
      </Dialog>
      {poster.map((p, i) => (
        <Img
          key={i}
          src={p}
          alt="poster"
          className="w-18 h-18 object-cover cursor-pointer"
          onClick={() => setActive(i)}
        />
      ))}
    </div>
  )
}

export default PosterImages
