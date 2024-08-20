import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import router, { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoHome } from 'react-icons/io5'
import { IoHomeOutline } from 'react-icons/io5'
import { IoGift } from 'react-icons/io5'
import { IoGiftOutline } from 'react-icons/io5'
import { IoPeopleOutline } from 'react-icons/io5'
import { IoPeopleSharp } from 'react-icons/io5'
import { FaRegLightbulb } from 'react-icons/fa'
import { FaLightbulb } from 'react-icons/fa'
import { IoDiamondOutline } from 'react-icons/io5'
import { IoDiamond } from 'react-icons/io5'
import { LuUser2 } from 'react-icons/lu'
import { RiNotification3Line } from 'react-icons/ri'
import { RiNotification3Fill } from 'react-icons/ri'
import { FaRegHandshake } from 'react-icons/fa'
import { FaHandshake } from 'react-icons/fa6'
import { IoLanguageOutline } from 'react-icons/io5'
import { IoLanguage } from 'react-icons/io5'
import { Button } from './ui/button'
import IdeaFloatButton from '@/views/memex/components/idea-float-button'
import { useUserStore } from '@/stores/use-user-store'

interface MemexNavs {
  title: string
  path?: string
  icon: React.ReactNode
  icon_active: React.ReactNode
}

export const MemexMenu = () => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { userInfo } = useUserStore()
  const navs: MemexNavs[] = [
    {
      title: t('Idea'),
      path: Routes.Memex,
      icon: <FaRegLightbulb />,
      icon_active: <FaLightbulb />,
    },
    {
      title: t('Coin'),
      path: Routes.MemexDetailsCoin,
      icon: <IoDiamondOutline />,
      icon_active: <IoDiamond />,
    },
    {
      title: t('profile'),
      path: Routes.MemexDetailsProfile,
      icon: <LuUser2 />,
      icon_active: <IoPeopleSharp />,
    },
    {
      title: t('Notification'),
      path: Routes.MemexDetailsNotification,
      icon: <RiNotification3Line />,
      icon_active: <RiNotification3Fill />,
    },
    {
      title: t('airdrop.no.icon'),
      path: Routes.MemexDetailsAirdrop,
      icon: <IoGiftOutline />,
      icon_active: <IoGift />,
    },
    {
      title: t('alliance'),
      path: Routes.MemexDetailsAlliance,
      icon: <FaRegHandshake />,
      icon_active: <FaHandshake />,
    },
    {
      title: t('Languages'),
      icon: <IoLanguageOutline />,
      icon_active: <IoLanguage />,
    },
  ]

  const onNavClick = (n: MemexNavs) => {
    push({ pathname: n.path })
  }

  return (
    <div className="flex flex-col space-y-4 mt-4 justify-start xl:w-60 box-border-custom pr-6 fixed left-0">
      {navs.map((nav) => {
        if (nav.path === Routes.MemexDetailsProfile && !userInfo) return
        return (
          <div
            key={nav.path}
            className={cn(
              'flex items-center text-xl font-medium space-x-2 cursor-pointer hover:bg-zinc-200 p-2 rounded-lg',
              'max-xl:text-2xl max-xl:justify-center'
            )}
            onClick={() => {
              if (nav.path === Routes.MemexDetailsProfile) {
                return router.push(
                  `${Routes.MemexDetailsProfile}/${userInfo?.wallet_address}`
                )
              }
              onNavClick(nav)
            }}
          >
            <span>{nav.icon}</span>
            <span className="max-xl:hidden">{nav.title}</span>
          </div>
        )
      })}
      <Button
        shadow={'none'}
        onClick={() => router.push(Routes.MemexCreate)}
        className="bg-purple-700 text-white rounded-full border-none py-6 text-lg max-xl:hidden"
      >
        {t('Post.idea')}
      </Button>

      <div className="xl:hidden">
        <IdeaFloatButton />
      </div>
    </div>
  )
}
