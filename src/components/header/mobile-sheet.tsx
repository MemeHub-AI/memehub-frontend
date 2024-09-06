import { CiWallet } from 'react-icons/ci'
import BigNumber from 'bignumber.js'
import { LuUser2 } from 'react-icons/lu'
import { IoGiftOutline } from 'react-icons/io5'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { MdErrorOutline } from 'react-icons/md'

import { UserInfoRes, UserListType } from '@/api/user/types'
import { Avatar } from '../ui/avatar'
import { useTranslation } from 'react-i18next'
import LangSelect from '../lang-select'
import { fmt } from '@/utils/fmt'
import { useChainsStore } from '@/stores/use-chains-store'
import { useUserList } from '@/views/account/hooks/use-user-list'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import { memehubLinks } from '@/config/link'
import HowToWorkDialog from '../how-to-work-dialog'
import SocialLinks from '../social-links'
import { useAccount } from 'wagmi'

export const HeaderMobileSheet = ({
  userInfo,
  setSheetOpen,
}: {
  userInfo: UserInfoRes | null
  setSheetOpen: (status: boolean) => void
}) => {
  const { t } = useTranslation()
  const followersResults = useUserList(UserListType.Followers)
  const followingResults = useUserList(UserListType.Following)
  const { push } = useRouter()
  const { followers } = followersResults
  const { following } = followingResults

  const { chain } = useAccount()
  const { evmChainsMap } = useChainsStore()
  const currentChain = evmChainsMap[chain?.id || 0]

  const navs = [
    {
      title: t('profile'),
      icon: <LuUser2 />,
      path: `/${Routes.Account}/${userInfo?.wallet_address}`,
    },
    {
      title: t('airdrop.no.icon'),
      icon: <IoGiftOutline />,
      path: Routes.Airdrop,
    },
    {
      title: t('apply.cooperation'),
      icon: <BsFileEarmarkPlus />,
      path: memehubLinks.kolForm,
    },
  ]

  return (
    <div className="pl-2">
      <div className="w-fit flex items-start flex-col max-w-full space-y-2">
        <Avatar
          className="w-16 h-16 rounded-full"
          src={userInfo?.logo}
          alt="avatar"
        />
        <span className="text-lg font-semibold w-full truncate">
          {userInfo?.name || ''}
        </span>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-2">
        <span className="flex items-center space-x-2 text-sm">
          <CiWallet />
          <span>{fmt.addr(userInfo?.wallet_address)}</span>
        </span>

        {currentChain && (
          <span className="flex items-center space-x-2 text-sm">
            <img src={currentChain?.logo} className="w-5 h-5" />
            <span>{currentChain?.displayName}</span>
          </span>
        )}
        {!currentChain && (
          <span className="flex items-center space-x-2 text-sm text-red-500">
            <MdErrorOutline />
            <span>{t('error.chain')}</span>
          </span>
        )}

        <span className="whitespace-nowrap overflow-hidden">
          <span className="truncate font-semibold">
            {BigNumber(fmt.decimals(followers.total)).toFormat()}
          </span>{' '}
          <span className="text-zinc-500 text-sm">{t('following')}</span>
        </span>
        <span className="truncate">
          <span>{BigNumber(fmt.decimals(following.total)).toFormat()} </span>
          <span className="text-zinc-500 text-sm">{t('followers')}</span>
        </span>
      </div>
      <div className="space-y-4 mt-4">
        {navs.map((nav, i) => (
          <div
            key={i}
            className="flex items-center text-base font-semibold space-x-4 cursor-pointer"
            onClick={() => {
              setSheetOpen(false)
              push(nav.path)
            }}
          >
            <span className="text-xl">{nav.icon}</span>
            <span className="whitespace-nowrap">{nav.title}</span>
          </div>
        ))}
        <LangSelect className="w-full justify-start text-base" />
        <HowToWorkDialog />
        <SocialLinks
          x={memehubLinks.x}
          tg={memehubLinks.tg}
          whitepaper={memehubLinks.whitepaper}
          className="justify-start"
          size={28}
        />
      </div>
    </div>
  )
}

export default HeaderMobileSheet
