import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { IoHome } from 'react-icons/io5'
import { IoHomeOutline } from 'react-icons/io5'
import { IoGift } from 'react-icons/io5'
import { IoGiftOutline } from 'react-icons/io5'
import { IoPeopleOutline } from 'react-icons/io5'
import { IoPeopleSharp } from 'react-icons/io5'

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
      title: t('home'),
      path: Routes.Main,
      icon: <IoHomeOutline />,
      icon_active: <IoHome />,
    },
    {
      title: t('airdrop.no.icon'),
      path: Routes.Airdrop,
      icon: <IoGiftOutline />,
      icon_active: <IoGift />,
    },
    {
      title: t('alliance'),
      path: Routes.Alliance,
      icon: <IoPeopleOutline />,
      icon_active: <IoPeopleSharp />,
    },
  ]

  const onNavClick = (n: MemexNavs) => {
    push({ pathname: n.path })
  }

  return (
    <div className="flex flex-col space-y-4 mt-4 justify-start xl:w-42">
      <div
        className="flex space-x-2 items-center cursor-pointer pl-2 max-xl:justify-end"
        onClick={() => push({ pathname: Routes.Main })}
      >
        <img src="/images/logo.png" alt="icon" className="w-8 h-8" />
        <img
          src="/images/logo.svg"
          alt="MemeHub"
          className="w-20 h-8 max-xl:hidden"
        />
      </div>

      {navs.map((nav) => (
        <div
          key={nav.path}
          className={cn(
            'flex items-center text-xl font-medium space-x-2 cursor-pointer hover:bg-zinc-200 p-2 rounded-lg',
            'max-xl:text-2xl max-xl:justify-end'
          )}
          onClick={() => onNavClick(nav)}
        >
          <span>{nav.icon}</span>
          <span className="max-xl:hidden">{nav.title}</span>
        </div>
      ))}
      <div className="fixed bottom-2"></div>
    </div>
  )
}
