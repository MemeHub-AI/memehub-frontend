import React, { ComponentProps, useState } from 'react'

import { defaultImg } from '@/config/link'
import { cn } from '@/lib/utils'

export const Img = ({ src, className, ...props }: ComponentProps<'img'>) => {
  const [placeholder, setPlacehoder] = useState(true)

  return (
    <img
      src={src || defaultImg}
      loading="lazy"
      onLoad={() => setPlacehoder(false)}
      className={cn(
        'object-cover bg-no-repeat bg-cover',
        placeholder && 'bg-[url(/images/logo.png)]',
        className
      )}
      {...props}
    />
  )
}

export default Img
