import { useRouter } from 'next/router'
import { useResponsive } from './use-responsive'
import { Routes } from '@/routes'

export const useIsMemex = () => {
  const { pathname } = useRouter()
  const { isPad, isLaptop } = useResponsive()

  /** It is memex page but not mobile */
  const isMemex = pathname.includes(Routes.Memex) && !isPad

  const isHiddenMoonShot = () => {
    return (
      isMemex &&
      (pathname.includes(Routes.MemexDetailsCoin) ||
        pathname.includes(Routes.MemexDetailsProfile) ||
        pathname.includes(Routes.MemexDetailsAirdrop) ||
        pathname.includes(Routes.MemexDetailsAlliance)) &&
      isLaptop
    )
  }

  return { isMemex, isHiddenMoonShot }
}
