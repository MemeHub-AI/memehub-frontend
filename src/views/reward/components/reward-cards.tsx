import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Img } from '@/components/img'
import { CustomSuspense } from '@/components/custom-suspense'
import { cn } from '@/lib/utils'
import { useRewardCards } from '../hooks/use-reward-cards'
import { ChainData } from '@/api/chain/type'
import { fmt } from '@/utils/fmt'
import { useReward } from '../hooks/use-reward'
import { useChainInfo } from '@/hooks/use-chain-info'

export const RewardCards = ({ className }: ComponentProps<'h2'>) => {
  const { t } = useTranslation()
  const { rewardList } = useRewardCards()

  return (
    <>
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.invite')}
      </h2>
      <CustomSuspense
        isPending={false}
        fallback={<>Waiting for fill</>}
        container="div"
        className={cn(
          'grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          '2xl:grid-cols-5 2xl:max-w-256'
        )}
      >
        {rewardList.map((r, i) => (
          <RewardCard key={i} c={r} />
        ))}
      </CustomSuspense>
    </>
  )
}

const RewardCard = ({ c }: { c: ChainData }) => {
  const { t } = useTranslation()
  const { chain, chainName, chainId } = useChainInfo(c.name)
  const { totalAmount, unclaimedAmount, isClaiming, isClaimed, claimReward } =
    useReward(chainName, chainId)

  const disabeld = isClaiming || isClaimed

  return (
    <Card shadow="none" padding="sm" className="cursor-[unset]">
      <div className="flex items-center space-x-2">
        <Img src={c.logo} alt="logo" className="w-6 h-6" />
        <p>{chain?.displayName}</p>
      </div>

      <div className="mt-3">
        <p>{t('reward.invite.total-earned')}</p>
        <span className="text-2xl font-bold">{fmt.decimals(totalAmount)}</span>
        <span className="ml-2">{chain?.native.symbol}</span>
      </div>

      <div className="mt-3">
        <p>{t('reward.invite.unclaimed')}</p>
        <span className="text-2xl font-bold">
          {fmt.decimals(unclaimedAmount)}
        </span>
        <span className="ml-2">{chain?.native.symbol}</span>
      </div>

      <Button
        shadow="none"
        className="mt-2 w-full"
        onClick={claimReward}
        disabled={disabeld}
      >
        {isClaiming ? t('claiming') : t('reward.invite.claim')}
      </Button>
    </Card>
  )
}

export default RewardCards
