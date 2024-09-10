import { ComponentProps, useEffect, useState } from 'react'
import { IoGift, IoLanguageOutline } from 'react-icons/io5'
import { IoGiftOutline } from 'react-icons/io5'
import { FaRegLightbulb } from 'react-icons/fa'
import { FaLightbulb } from 'react-icons/fa'
import { IoDiamondOutline } from 'react-icons/io5'
import { IoDiamond } from 'react-icons/io5'
import { RiNotification3Line, RiRocketFill, RiRocketLine } from 'react-icons/ri'
import { RiNotification3Fill } from 'react-icons/ri'
import { FaRegHandshake } from 'react-icons/fa'
import { FaHandshake } from 'react-icons/fa6'
import { FaRegUser } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'

import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/use-user-store'
import { useLang } from '@/hooks/use-lang'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { memehubLinks } from '@/config/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { joinPaths } from '@/utils'
import { useResponsive } from '@/hooks/use-responsive'
import Logo from '@/components/logo'
import HowToWorkDialog from '@/components/how-to-work-dialog'
import SocialLinks from '@/components/social-links'
import NavAccount from './nav-account'
import RewardButton from '@/components/reward-button'

interface Props {
  collapseSize?: keyof ReturnType<typeof useResponsive>
}

export const NavAside = ({
  className,
  collapseSize = 'isLaptop',
  ...props
}: ComponentProps<'div'> & Props) => {
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()
  const { pathname, ...router } = useRouter()
  const { userInfo } = useUserStore()
  const responsive = useResponsive()
  const [isCollapsed, setIsCollapsed] = useState(responsive[collapseSize])

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
      title: t('memex.idea'),
      path: Routes.MemexIdea,
      icon: <FaRegLightbulb />,
      iconActive: <FaLightbulb />,
      isActive: pathname.includes(Routes.MemexIdea),
    },
    {
      title: t('Coin'),
      path: Routes.Coin,
      icon: <RiRocketLine />,
      iconActive: <RiRocketFill />,
      isActive: pathname === Routes.Coin,
    },
    ...(userInfo ? userNavs : []),
    {
      title: t('award'),
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

  useEffect(() => {
    setIsCollapsed(responsive[collapseSize])
  }, [responsive, collapseSize])

  return (
    <aside
      className={cn(
        'flex flex-col w-56 pt-4 select-none justify-between h-screen pb-4',
        isCollapsed && 'w-10 items-center',
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        <Logo
          showMeme
          showLogo={!isCollapsed}
          className="w-28"
          linkClass="pl-1 relative"
          betaClass={isCollapsed ? 'absolute -bottom-5' : ''}
        />

        <NavigationMenu className="grid grid-cols-1 max-w-full">
          <NavigationMenuList className="grid grid-cols-1 space-x-0 space-y-3">
            {navs.map((n, i) => (
              <NavigationMenuItem key={i} className="w-full cursor-pointer">
                <NavigationMenuLink
                  className={cn(
                    'text-xl w-full flex justify-start py-5 space-x-2 pl-2 cursor-pointer font-normal',
                    n.isActive && 'font-bold',
                    isCollapsed && 'space-x-0 p-2 justify-center'
                  )}
                  onClick={() => router.push(n.path)}
                  title={n.title}
                >
                  {n.isActive ? n.iconActive : n.icon}
                  {!isCollapsed && <span>{n.title}</span>}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          shadow="none"
          onClick={() => router.push(Routes.MemexCreate)}
          className={cn(
            'bg-blue-400 text-white rounded-full border-none py-6 text-lg',
            'mt-2 max-xl:text-base ml-1 max-xl:text-md w-full',
            isCollapsed && 'p-2'
          )}
          size={isCollapsed ? 'icon-lg' : 'default'}
        >
          {isCollapsed ? (
            <img src="/icons/writer.svg" alt="writer" />
          ) : (
            t('post-idea')
          )}
        </Button>

        <HowToWorkDialog isCollapsed={isCollapsed} />

        <div
          className={cn(
            'flex space-x-2 items-center',
            isCollapsed && 'flex-col space-x-0 space-y-1 ml-1'
          )}
        >
          <div
            className={cn(
              'flex justify-center items-center mt-1 space-x-1 ',
              className
            )}
            {...props}
          >
            <Button
              type="button"
              shadow="none"
              size={isCollapsed ? 'icon' : 'icon-lg'}
              title={t('change.language')}
              onClick={() =>
                i18n.language === 'en' ? setLang('zh') : setLang('en')
              }
              className="border-transparent !bg-transparent sm:hover:border-black"
            >
              <IoLanguageOutline size={20} />
            </Button>
          </div>

          <SocialLinks
            x={memehubLinks.x}
            tg={memehubLinks.tg}
            whitepaper={memehubLinks.whitepaper}
            size={20}
            buttonProps={{ size: isCollapsed ? 'icon' : 'icon-lg' }}
            className={cn(
              'justify-start',
              isCollapsed && 'flex-col space-x-0 space-y-1 ml-1'
            )}
          />
        </div>
      </div>

      <div className={cn('flex flex-col items-start', !userInfo && 'w-full')}>
        <NavAccount userInfo={userInfo} isCollapsed={isCollapsed} />

        <RewardButton
          shadow="none"
          showReferral={isCollapsed ? false : true}
          className={cn(
            'border-none w-full justify-between mt-3',
            isCollapsed && 'w-fit p-2'
          )}
        />
      </div>
    </aside>
  )
}
