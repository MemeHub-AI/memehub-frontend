import { type ReactNode } from 'react'

import { NewsAside } from '@/components/news-aside'
import { MemexMenu } from './memex-menu'
import { cn } from '@/lib/utils'

export const memexBodyId = 'memex-body'

export const MemexLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <main className={cn('flex sm:space-x-6 justify-between px-6 max-sm:px-0')}>
      <div className="xl:border-r max-sm:hidden">
        <MemexMenu className="sticky top-20" />
      </div>
      {children}
      <NewsAside className="!border-r-0 pr-0 max-sm:hidden" />
    </main>
  )
}

export default MemexLayout
