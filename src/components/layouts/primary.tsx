import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Header } from '../header'
import { NewsAside } from '../news-aside'
import { NavAside } from '@/components/nav-aside'

interface Props extends ComponentProps<'main'> {
  disablePadding?: boolean
  containerClass?: string
  contentClass?: string
  navAsideClass?: string
  newsAsideClass?: string
}

export const PrimaryLayout = ({
  className,
  children,
  disablePadding = false,
  containerClass,
  contentClass,
  navAsideClass,
  newsAsideClass,
}: Props) => {
  return (
    <main className={cn('min-h-main flex max-w-[100vw]', className)}>
      <div
        className={cn(
          'border-r-2 px-4 max-sm:hidden min-h-screen',
          navAsideClass
        )}
      >
        <NavAside className="sticky top-0 shrink-0" />
      </div>

      <div className="flex-1">
        <Header />
        <div className={cn('flex', containerClass)}>
          <div
            className={cn(
              'flex-1 ',
              !disablePadding && 'p-3 sm:p-6',
              contentClass
            )}
          >
            {children}
          </div>

          <NewsAside className={newsAsideClass} />
        </div>
      </div>
    </main>
  )
}

export default PrimaryLayout
