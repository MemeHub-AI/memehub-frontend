import React, { ComponentProps, ReactDOM, createElement } from 'react'

import { OpportunityMoonshot } from '../opportunity-moonshot'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'div'> {
  mainClass?: string
  asideProps?: ComponentProps<typeof OpportunityMoonshot>
  container?: keyof ReactDOM | 'fragment'
}

export const PrimaryLayout = (props: Props) => {
  const {
    mainClass,
    children,
    asideProps = {},
    container = 'fragment',
    ...restProps
  } = props
  const {
    className: aClass,
    containerClass: aContainerClass,
    ...restAsideProps
  } = asideProps

  return (
    <main
      className={cn(
        'min-h-main px-6 flex max-sm:px-3 max-sm:pt-0 gap-6',
        mainClass
      )}
    >
      <OpportunityMoonshot
        defalutTab={1}
        className={cn('max-sm:!hidden', aClass)}
        containerClass={cn('!ml-0', aContainerClass)}
        {...restAsideProps}
      />

      {container === 'fragment'
        ? children
        : createElement(container, restProps, children)}
    </main>
  )
}

export default PrimaryLayout
