import React, { ComponentProps } from 'react'

import { OpportunityMoonshot } from '../opportunity-moonshot'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'main'> {
  asideProps?: ComponentProps<typeof OpportunityMoonshot>
}

export const PrimaryLayout = ({
  className,
  children,
  asideProps,
  ...props
}: Props) => {
  const {
    className: aClass,
    containerClass: aContainerClass,
    ...restAsideProps
  } = asideProps ?? {}

  return (
    <main
      className={cn(
        'min-h-main px-6 flex max-sm:px-3 max-sm:pt-0 gap-6',
        className
      )}
      {...props}
    >
      <OpportunityMoonshot
        defalutTab={1}
        className={cn('max-sm:!hidden', aClass)}
        containerClass={cn('!ml-0', aContainerClass)}
        {...restAsideProps}
      />
      {children}
    </main>
  )
}

export default PrimaryLayout
