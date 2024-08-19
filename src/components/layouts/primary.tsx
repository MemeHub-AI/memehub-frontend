import React, { type ComponentProps, type ReactDOM, createElement } from 'react'

import { OpportunityMoonshot } from '../opportunity-moonshot'
import { cn } from '@/lib/utils'
import { useIsMemex } from '@/hooks/use-is-memex'
import { MemexMenu } from '../memex-menu'

interface Props extends ComponentProps<'div'> {
  mainClass?: string
  asideProps?: ComponentProps<typeof OpportunityMoonshot>
  container?: keyof ReactDOM | 'fragment'
  padding?: boolean
}

export const PrimaryLayout = (props: Props) => {
  const {
    mainClass,
    children,
    asideProps = {},
    container = 'fragment',
    padding = true,
    ...restProps
  } = props
  const {
    className: aClass,
    containerClass: aContainerClass,
    ...restAsideProps
  } = asideProps
  const { isMemex } = useIsMemex()

  return (
    <main
      className={cn(
        'min-h-main max-sm:pt-0',
        padding && 'px-6 flex max-sm:px-3 gap-6',
        mainClass,
        isMemex && 'justify-center space-x-4'
      )}
    >
      <OpportunityMoonshot
        className={cn('max-sm:!hidden', aClass)}
        containerClass={cn('!ml-0', aContainerClass)}
        {...restAsideProps}
      />

      {container === 'fragment'
        ? children
        : createElement(container, restProps, children)}

      {isMemex && <MemexMenu />}
    </main>
  )
}

export default PrimaryLayout
