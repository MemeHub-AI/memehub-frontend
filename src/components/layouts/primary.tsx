import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { Header } from '../header'
import { NewsAside } from '../news-aside'
import { NavAside } from '@/components/nav-aside'
import MobileNavBottom from '../mobile-nav-bottom'
import HandleScroll, { ScrollVariant } from '../handle-scroll'

interface Props extends ComponentProps<'main'> {
  disablePadding?: boolean
  containerClass?: string
  contentClass?: string
  navAsideClass?: string
  newsAsideClass?: string
  navAsideProps?: ComponentProps<typeof NavAside>
  newsAsideProps?: ComponentProps<typeof NewsAside>
}

export const PrimaryLayout = ({
  className,
  children,
  disablePadding = false,
  containerClass,
  contentClass,
  navAsideClass,
  newsAsideClass,
  navAsideProps,
  newsAsideProps,
}: Props) => {
  return (
    <main className={cn('min-h-main flex max-w-[100vw]', className)}>
      <div
        className={cn(
          'border-r px-4 max-lg:hidden min-h-screen',
          navAsideClass
        )}
      >
        <NavAside className="sticky top-0 shrink-0" {...navAsideProps} />
      </div>

      <div className="flex-1 max-lg:pb-14">
        <HandleScroll variant={ScrollVariant.Top}>
          <Header />
        </HandleScroll>

        <div className={cn('flex', containerClass)}>
          <div
            className={cn(
              'flex-1 lg:overflow-x-hidden',
              !disablePadding && 'p-3 sm:p-4',
              contentClass
            )}
          >
            {children}
          </div>

          <NewsAside
            className={cn('sticky top-0', newsAsideClass)}
            {...newsAsideProps}
          />
        </div>

        <HandleScroll variant={ScrollVariant.Bottom}>
          <MobileNavBottom />
        </HandleScroll>
      </div>
    </main>
  )
}

export default PrimaryLayout
