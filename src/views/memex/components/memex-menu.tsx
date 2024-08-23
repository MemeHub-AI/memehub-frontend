import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import router, { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoGift, IoLanguageOutline } from 'react-icons/io5'
import { IoGiftOutline } from 'react-icons/io5'
import { FaRegLightbulb } from 'react-icons/fa'
import { FaLightbulb } from 'react-icons/fa'
import { IoDiamondOutline } from 'react-icons/io5'
import { IoDiamond } from 'react-icons/io5'
import { RiNotification3Line } from 'react-icons/ri'
import { RiNotification3Fill } from 'react-icons/ri'
import { FaRegHandshake } from 'react-icons/fa'
import { FaHandshake } from 'react-icons/fa6'
import { FaRegUser } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'
import { Button } from '../../../components/ui/button'
import IdeaFloatButton from '@/views/memex/components/idea-float-button'
import { useUserStore } from '@/stores/use-user-store'
import {
  Arrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { useLang } from '@/hooks/use-lang'
import { resources } from '@/i18n'
import { FaSquareTwitter } from 'react-icons/fa6'
import { FaTelegramPlane } from 'react-icons/fa'
import { socialLink } from '@/config/link'
import { FaXTwitter } from 'react-icons/fa6'

interface MemexNavs {
  title: string
  path: string
  icon: React.ReactNode
  icon_active: React.ReactNode
}

const langs = Object.entries(resources as Record<string, { name: string }>)

export const MemexMenu = () => {
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()
  const { push, pathname } = useRouter()
  const { userInfo } = useUserStore()

  // console.log('pathname: ', pathname)

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
      icon: <FaRegUser />,
      icon_active: <FaUser />,
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
  ]

  const onNavClick = (n: MemexNavs) => {
    push({ pathname: n.path })
  }

  const isCurrentPath = (name: string) => {
    if (name === Routes.Memex) {
      if (
        pathname === `${Routes.Memex}/latest` ||
        pathname === `${Routes.Memex}/hots` ||
        pathname === `${Routes.Memex}/my-idea` ||
        pathname === `${Routes.Memex}/my-involved` ||
        pathname === `${Routes.Memex}/successed`
      ) {
        return true
      }
      return false
    }

    return pathname.includes(name)
  }

  return (
    <div
      className={cn(
        'flex flex-col space-y-4 mt-4 justify-start xl:w-60 pr-6 fixed left-2',
        'relative xl:after:absolute xl:after:-top-20 xl:after:bottom-0 xl:after:right-0 xl:after:bg-zinc-200 xl:after:w-px'
      )}
    >
      {navs.map((nav, index) => {
        if (nav.path === Routes.MemexDetailsProfile && !userInfo) return
        return (
          <div
            key={index}
            className={cn(
              'flex items-center text-xl font-medium space-x-2 cursor-pointer hover:bg-zinc-200 p-2 rounded-lg',
              'max-xl:text-lg'
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
            <span className="xl:text-2xl xl:mr-2">
              {!isCurrentPath(nav.path) ? nav.icon : nav.icon_active}
            </span>
            <span className={cn('', isCurrentPath(nav.path) && 'font-bold')}>
              {nav.title}
            </span>
          </div>
        )
      })}
      <Popover>
        <PopoverTrigger>
          <div
            className={cn(
              'flex items-center text-xl font-medium space-x-2 cursor-pointer hover:bg-zinc-200 p-2 rounded-lg',
              'max-xl:text-2xl max-xl:justify-center'
            )}
          >
            <span className="xl:text-2xl xl:mr-2 max-xl:text-lg">
              <IoLanguageOutline />
            </span>
            <span className="max-xl:text-lg">{t('Languages')}</span>
          </div>
        </PopoverTrigger>

        <PopoverContent side="right" align="end">
          <div className="bg-slate-50 py-4 px-6 flex space-y-2 flex-col rounded-md">
            {langs.map(([code, { name }], i) => (
              <Button
                key={i}
                onClick={() => setLang(code)}
                variant="ghost"
                shadow="none"
                className={cn(
                  'w-full justify-start hover:bg-zinc-200 rounded-lg p-4 bg-slate-50',
                  i18n.language === code && 'font-bold'
                )}
              >
                {name}
              </Button>
            ))}
          </div>

          <Arrow className="fill-slate-50" width={20} height={30} />
        </PopoverContent>
      </Popover>

      <Button
        shadow={'none'}
        onClick={() => router.push(Routes.MemexCreate)}
        className="bg-purple-700 text-white rounded-full border-none max-xl:text-md py-6 text-lg mt-2"
      >
        {t('Post.idea')}
      </Button>

      <div className="flex justify-center xl:space-x-8 max-xl:space-x-4">
        <FaXTwitter
          size={28}
          className="cursor-pointer"
          onClick={() => window.open(socialLink.x)}
        />
        <FaTelegramPlane
          size={28}
          className="cursor-pointer"
          onClick={() => window.open(socialLink.tg)}
        />
      </div>

      {/* <div className="xl:hidden">
        <IdeaFloatButton />
      </div> */}
    </div>
  )
}
