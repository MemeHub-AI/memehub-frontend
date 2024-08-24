import React, { type ComponentProps } from 'react'

import { NewsAside } from '../news-aside'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'main'> {
  padding?: boolean
  asideProps?: ComponentProps<typeof NewsAside>
}

export const PrimaryLayout = ({
  className,
  children,
  padding = true,
  asideProps = {},
  ...props
}: Props) => {
  const {
    className: asideClass,
    containerClass: asideContainerClass,
    ...restAsideProps
  } = asideProps

  return (
    <main
      className={cn(
        'min-h-main max-sm:pt-0',
        padding && 'px-6 flex max-sm:px-3 gap-6',
        className
      )}
      {...props}
    >
      <NewsAside
        className={cn('max-sm:!hidden', asideClass)}
        containerClass={cn('!ml-0', asideContainerClass)}
        {...restAsideProps}
      />

      {children}
    </main>
  )
}

export default PrimaryLayout
