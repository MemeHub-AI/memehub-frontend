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

interface MemexNavs {
  title: string
  path: string
  icon: React.ReactNode
  icon_active: React.ReactNode
}

export const MemexMenu = () => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const navs: MemexNavs[] = [
    {
      title: t('Idea'),
      path: Routes.Main,
      icon: <FaRegLightbulb />,
      icon_active: <FaLightbulb />,
    },
    {
      title: t('Coin'),
      path: Routes.Airdrop,
      icon: <IoDiamondOutline />,
      icon_active: <IoDiamond />,
    },
    {
      title: t('profile'),
      path: Routes.Alliance,
      icon: <LuUser2 />,
      icon_active: <IoPeopleSharp />,
    },
    {
      title: t('Notification'),
      path: Routes.MemexMyIdea,
      icon: <RiNotification3Line />,
      icon_active: <RiNotification3Fill />,
    },
    {
      title: t('airdrop.no.icon'),
      path: Routes.MemexMyInvolved,
      icon: <IoGiftOutline />,
      icon_active: <IoGift />,
    },
    {
      title: t('alliance'),
      path: Routes.MemexSuccessed,
      icon: <FaRegHandshake />,
      icon_active: <FaHandshake />,
    },
    {
      title: t('Languages'),
      path: Routes.MemexIdea,
      icon: <IoLanguageOutline />,
      icon_active: <IoLanguage />,
    },
  ]

  const onNavClick = (n: MemexNavs) => {
    push({ pathname: n.path })
  }

  return (
    <div className="flex flex-col space-y-4 mt-4 justify-start xl:w-52">
      {/* <div
        className="flex space-x-2 items-center cursor-pointer pl-2 max-xl:justify-end"
        onClick={() => push({ pathname: Routes.Main })}
      >
        <img src="/images/logo.png" alt="icon" className="w-10 h-10" />
        <img
          src="/images/logo.svg"
          alt="MemeHub"
          className="w-24 h-10 max-xl:hidden"
        />
      </div> */}

      {navs.map((nav) => (
        <div
          key={nav.path}
          className={cn(
            'flex items-center text-xl font-medium space-x-2 cursor-pointer hover:bg-zinc-200 p-2 rounded-lg',
            'max-xl:text-2xl max-xl:justify-center'
          )}
          onClick={() => onNavClick(nav)}
        >
          <span>{nav.icon}</span>
          <span className="max-xl:hidden">{nav.title}</span>
        </div>
      ))}
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
