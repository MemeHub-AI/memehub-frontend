import React, { type ComponentProps } from 'react'

import { NewsAside } from '../news-aside'
import { cn } from '@/lib/utils'
import { NavAside } from '@/components/nav-aside'
import { Header } from '../header'

interface Props extends ComponentProps<'main'> {
  asideProps?: ComponentProps<typeof NewsAside>
  padding?: boolean
  newsVisible?: 'always' | 'auto'
  containerClass?: string
  contentClass?: string
}

export const PrimaryLayout = ({
  className,
  children,
  padding = true,
  newsVisible = 'auto',
  containerClass,
  contentClass,
}: Props) => {
  return (
    <main className={cn('min-h-main flex max-w-[100vw]', className)}>
      <div className="border-r-2 px-4 max-sm:hidden min-h-screen">
        <NavAside className="sticky top-0 shrink-0" />
      </div>

      <div className="flex-1">
        <Header />
        <div className={cn('flex', containerClass)}>
          <div className={cn('flex-1 ', padding && 'p-3 sm:p-6', contentClass)}>
            {children}
          </div>
          <NewsAside
            className={cn(newsVisible === 'auto' && 'hidden xl:block')}
          />
        </div>
      </div>
    </main>
  )
}

export default PrimaryLayout
