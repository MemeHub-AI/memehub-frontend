import { ComponentProps } from 'react'
import { useRouter } from 'next/router'
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
import { CheckIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/use-user-store'
import { useLang } from '@/hooks/use-lang'
import { resources } from '@/i18n'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { socialLink } from '@/config/link'
import { Logo } from './logo'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import { SocialLinks } from './social-links'
import { joinPaths } from '@/utils'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const NavAside = ({ className, ...props }: ComponentProps<'div'>) => {
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()
  const { pathname, ...router } = useRouter()
  const { userInfo } = useUserStore()

  const userNavs = [
    {
      title: t('profile'),
      path: joinPaths(Routes.Account, userInfo?.wallet_address || ''),
      icon: <FaRegUser />,
      iconActive: <FaUser />,
      isActive: pathname.includes(Routes.Account),
    },
  ]

  const navs = [
    {
      title: t('Idea'),
      path: Routes.Memex,
      icon: <FaRegLightbulb />,
      iconActive: <FaLightbulb />,
      isActive: pathname.includes(Routes.Memex),
    },
    {
      title: t('Coin'),
      path: Routes.Main,
      icon: <IoDiamondOutline />,
      iconActive: <IoDiamond />,
      isActive: pathname === Routes.Main,
    },
    ...(userInfo ? userNavs : []),
    {
      title: t('Notification'),
      path: Routes.Notification,
      icon: <RiNotification3Line />,
      iconActive: <RiNotification3Fill />,
      isActive: pathname === Routes.Notification,
    },
    {
      title: t('airdrop.no.icon'),
      path: Routes.Airdrop,
      icon: <IoGiftOutline />,
      iconActive: <IoGift />,
      isActive: pathname === Routes.Airdrop,
    },
    {
      title: t('alliance'),
      path: Routes.Alliance,
      icon: <FaRegHandshake />,
      iconActive: <FaHandshake />,
      isActive: pathname === Routes.Alliance,
    },
  ]

  return (
    <aside
      className={cn('flex flex-col space-y-4 w-52 pt-4 select-none', className)}
      {...props}
    >
      <Logo showMeme className="w-28" linkClass="pl-1" />

      <NavigationMenu className="grid grid-cols-1 max-w-full">
        <NavigationMenuList className="grid grid-cols-1 space-x-0 space-y-3">
          {navs.map((n, i) => (
            <NavigationMenuItem key={i} className="w-full cursor-pointer">
              <NavigationMenuLink
                className={cn(
                  'text-xl w-full flex justify-start py-5 space-x-2 pl-2 cursor-pointer',
                  n.isActive && 'font-bold'
                )}
                onClick={() => router.push(n.path)}
              >
                {n.isActive ? n.iconActive : n.icon}
                <span>{n.title}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem className="w-full">
            <NavigationMenuTrigger className="text-xl w-full flex justify-start space-x-2 py-5 pl-2">
              <IoLanguageOutline />
              <span>{t('Languages')}</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-52 p-2 space-y-1">
                {langs.map(([code, { name }], i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    shadow="none"
                    className="w-full justify-start hover:bg-zinc-200 rounded-lg p-4 bg-slate-50"
                    onClick={() => setLang(code)}
                  >
                    {name}
                    {i18n.language === code && (
                      <CheckIcon className="h-5 w-5" />
                    )}
                  </Button>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        shadow="none"
        onClick={() => router.push(Routes.MemexCreate)}
        className="bg-purple-700 text-white rounded-full border-none max-xl:text-md py-5 text-lg mt-2 max-xl:text-base ml-1"
      >
        {t('Post.idea')}
      </Button>

      <SocialLinks
        x={socialLink.x}
        tg={socialLink.tg}
        size={28}
        buttonProps={{ size: 'icon-lg' }}
      />
    </aside>
  )
}
