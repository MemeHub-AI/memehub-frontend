import React, { ComponentProps } from 'react'
import Link from 'next/link'

import { Routes } from '@/routes'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  showMeme?: boolean
  linkClass?: string
}

export const Logo = ({
  className,
  showMeme = false,
  linkClass,
  ...props
}: Props) => {
  return (
    <Link
      href={Routes.Main}
      className={cn(
        'font-bold inline-flex items-center gap-2 shrink-0',
        linkClass
      )}
    >
      {showMeme && (
        <img src="/images/logo.png" alt="meme" className="w-10 max-sm:w-8" />
      )}
      <img
        src="/images/logo.svg"
        alt="logo"
        className={cn('w-24', className)}
        {...props}
      />
    </Link>
  )
}

export default Logo
