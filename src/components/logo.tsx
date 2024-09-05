import React, { ComponentProps } from 'react'
import Link from 'next/link'

import { Routes } from '@/routes'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  showMeme?: boolean
  showLogo?: boolean
  linkClass?: string
  betaClass?: string
}

export const Logo = ({
  className,
  showMeme = false,
  showLogo = true,
  linkClass,
  betaClass,
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
      {showLogo && (
        <img
          src="/images/logo.svg"
          alt="logo"
          className={cn('w-24', className)}
          {...props}
        />
      )}
      <span
        className={cn('font-normal text-blue-400 mt-1 max-lg:ml-2', betaClass)}
      >
        Beta
      </span>
    </Link>
  )
}

export default Logo
