import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'

import { NewsAside } from '@/components/news-aside'
import { useResponsive } from '@/hooks/use-responsive'
import { Routes } from '@/routes'
import { PrimaryLayout } from '@/components/layouts/primary'

export const NewsPage = () => {
  const { query } = useRouter()
  const { push } = useRouter()
  const { isPad } = useResponsive()

  useEffect(() => {
    if (!isPad) push(Routes.Main)
  }, [isPad])

  return (
    <NewsAside
      defalutTab={query.id}
      className="block"
      containerClass="!px-0"
      listClassName="!overflow-y-auto"
      tabClass="mt-0 mb-3"
    />
  )
}

NewsPage.getLayout = (page: ReactNode) => <PrimaryLayout>{page}</PrimaryLayout>

export default NewsPage
