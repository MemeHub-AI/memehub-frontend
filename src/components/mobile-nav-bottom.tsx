import { FaLightbulb, FaRegLightbulb } from 'react-icons/fa6'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'
import { RiNotification3Fill, RiNotification3Line } from 'react-icons/ri'
import { BsRocketTakeoff, BsRocketTakeoffFill } from 'react-icons/bs'
import { MdPeopleAlt, MdPeopleOutline } from 'react-icons/md'
import { AiFillFire, AiOutlineFire } from 'react-icons/ai'

import { useResponsive } from '@/hooks/use-responsive'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const MobileNavBottom = () => {
  const { isPad } = useResponsive()
  const { t } = useTranslation()
  const { push, pathname } = useRouter()

  const navs = [
    {
      title: t('memex.idea'),
      path: Routes.MemexIdea,
      icon: <FaRegLightbulb />,
      iconActive: <FaLightbulb />,
      isActive: pathname.includes(Routes.MemexIdea),
    },
    {
      title: t('Coin'),
      path: Routes.Coin,
      icon: <BsRocketTakeoff />,
      iconActive: <BsRocketTakeoffFill />,
      isActive: pathname === Routes.Coin,
    },
    {
      title: t('reward'),
      path: Routes.Reward,
      icon: <IoDiamondOutline />,
      iconActive: <IoDiamond />,
      isActive: pathname === Routes.Reward,
    },
    {
      title: t('Notification'),
      path: Routes.Notification,
      icon: <RiNotification3Line />,
      iconActive: <RiNotification3Fill />,
      isActive: pathname === Routes.Notification,
    },
    {
      title: t('fire'),
      path: Routes.NewsMoonshot,
      icon: <AiOutlineFire />,
      iconActive: <AiFillFire />,
      isActive: pathname.includes(Routes.News),
    },
    {
      title: t('alliance'),
      path: Routes.Alliance,
      icon: <MdPeopleOutline />,
      iconActive: <MdPeopleAlt />,
      isActive: pathname === Routes.Alliance,
    },
  ]

  if (!isPad) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white min-w-full',
        'border-t border-zinc-200'
      )}
    >
      {navs.map((nav, i) => (
        <div key={i} className="py-3 sm:px-4" onClick={() => push(nav.path)}>
          <span className="text-2xl">
            {nav.isActive ? nav.iconActive : nav.icon}
          </span>
        </div>
      ))}
    </div>
  )
}

export default MobileNavBottom
