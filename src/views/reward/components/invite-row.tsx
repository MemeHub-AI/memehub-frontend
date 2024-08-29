import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { useAccount } from 'wagmi'
import { IoCheckmark } from 'react-icons/io5'
import Link from 'next/link'

import { fmt } from '@/utils/fmt'
import { InfoIconDialog } from '@/components/info-icon-dialog'
import { RewardRules } from './reward-rules'
import { DiamondIcon } from '@/components/diamond-icon'
import { useUserStore } from '@/stores/use-user-store'
import { UserIcon } from '@/components/user-icon'
import { ConnectWallet } from '@/components/connect-wallet'
import { cn } from '@/lib/utils'
import { useClipboard } from '@/hooks/use-clipboard'

export const InviteRow = () => {
  const { t } = useTranslation()
  const { userInfo } = useUserStore()
  const { isConnected } = useAccount()
  const { isCopied, copy } = useClipboard()

  const inviteLink = `${window.location.origin}?r=${userInfo?.code || ''}`

  return (
    <div className="flex items-stretch mt-2 flex-wrap max-sm:max-w-full">
      <div className="flex flex-col justify-between flex-auto">
        <h3 className="font-bold text-lg inline-flex items-center">
          {t('reward.diamond-reward')}
          <InfoIconDialog>
            <RewardRules />
          </InfoIconDialog>
        </h3>
        <div className="flex items-center space-x-2">
          <DiamondIcon size={36} />
          <p className="text-blue-600 text-2xl font-bold">
            {BigNumber(fmt.decimals(userInfo?.reward_amount)).toFormat()}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-auto">
        <h3 className="font-bold text-lg">{t('reward.direct-invite-count')}</h3>
        <div className="flex items-center space-x-2">
          <UserIcon size={36} />
          <p className="text-blue-600 text-2xl font-bold">
            {BigNumber(userInfo?.inviter_count.one ?? 0).toFormat()}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-auto">
        <h3 className="font-bold text-lg">
          {t('reward.indirect-invite-count')}
        </h3>
        <div className="flex items-center space-x-2">
          <UserIcon type="user2" size={38} />
          <p className="text-blue-600 text-2xl font-bold">
            {BigNumber(userInfo?.inviter_count.two ?? 0).toFormat()}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <h3 className="font-bold text-lg">{t('reward.invite-friends')}</h3>
        <ConnectWallet>
          <div
            className={cn(
              'border-2 border-black rounded py-1 px-2 mt-1 flex items-center gap-3',
              !isConnected && 'justify-between'
            )}
          >
            <Link
              href={inviteLink}
              target="_blank"
              className="text-blue-600 hover:underline line-clamp-1"
            >
              {inviteLink}
            </Link>
            <div
              className="border-2 border-black rounded py-0.5 px-3 cursor-pointer hover:bg-zinc-100 whitespace-nowrap"
              onClick={() => copy(inviteLink)}
            >
              {isCopied ? (
                <IoCheckmark size={24} className="mx-2.5" />
              ) : (
                t('copy').toUpperCase()
              )}
            </div>
          </div>
        </ConnectWallet>
      </div>
    </div>
  )
}

export default InviteRow
