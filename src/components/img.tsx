import React, { type ComponentProps, useState } from 'react'

import { defaultImg } from '@/config/link'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  rounded?: boolean
}

export const Img = ({
  src,
  className,
  rounded = true,
  title,
  ...props
}: Props) => {
  const [placeholder, setPlacehoder] = useState(true)

  return (
    <img
      src={src || defaultImg}
      loading="lazy"
      title={title}
      onLoad={() => setPlacehoder(false)}
      className={cn(
        'object-cover bg-no-repeat bg-cover',
        placeholder && 'bg-[url(/images/logo.png)]',
        rounded && 'rounded-md',
        className
      )}
      {...props}
    />
  )
}

export default Img
