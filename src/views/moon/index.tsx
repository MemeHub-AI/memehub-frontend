import { NewsAside } from '@/components/news-aside'
import { useResponsive } from '@/hooks/use-responsive'
import { Routes } from '@/routes'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const MoonMemePage = () => {
  const router = useRouter()
  const { id } = router.query
  const { push } = useRouter()
  const { isPad } = useResponsive()

  useEffect(() => {
    if (!isPad) push(Routes.Main)
  }, [isPad])

  return (
    <div>
      <NewsAside
        className="relative"
        listClassName={clsx('max-md:!overflow-y-auto')}
        defalutTab={id}
      />
    </div>
  )
}

export default MoonMemePage
