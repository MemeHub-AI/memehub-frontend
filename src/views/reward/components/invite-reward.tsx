import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Img } from '@/components/img'
import { CustomSuspense } from '@/components/custom-suspense'
import { cn } from '@/lib/utils'

const cards = [
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'BNB Chain',
      symbol: 'BNB',
    },
    total: 0.23,
    unclaimed: 0.23,
  },
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'Scroll',
      symbol: 'ETH',
    },
    total: 0.3,
    unclaimed: 0.3,
  },
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'Blast',
      symbol: 'ETH',
    },
    total: 0.32,
    unclaimed: 0.32,
  },
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'Fantom',
      symbol: 'ETH',
    },
    total: 1.23,
    unclaimed: 1.23,
  },
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'Base',
      symbol: 'ETH',
    },
    total: 10.23,
    unclaimed: 10.23,
  },
  {
    chain: {
      logo: '/images/bsc.svg',
      name: 'zkSync',
      symbol: 'ETH',
    },
    total: 12.23,
    unclaimed: 12.23,
  },
]

export const InviteReward = ({ className }: ComponentProps<'h2'>) => {
  const { t } = useTranslation()

  return (
    <>
      <h2 className={cn('font-bold text-2xl mb-2', className)}>
        {t('reward.invite')}
      </h2>
      <CustomSuspense
        isPending={false}
        fallback={<>Waiting for fill</>}
        container="div"
        className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 2xl:w-3/4"
      >
        {cards.map((c, i) => (
          <InviteCard key={i} c={c} />
        ))}
      </CustomSuspense>
    </>
  )
}

const InviteCard = ({ c }: { c: (typeof cards)[number] }) => {
  const { t } = useTranslation()

  return (
    <Card shadow="none" padding="sm">
      <div className="flex items-center gap-2">
        <Img src={c.chain.logo} alt="logo" className="w-6 h-6" />
        <p>{c.chain.name}</p>
      </div>

      <div className="mt-3">
        <p>{t('reward.invite.total-earned')}</p>
        <span className="text-2xl font-bold">{c.total}</span>
        <span className="ml-2">{c.chain.symbol}</span>
      </div>

      <div className="mt-3">
        <p>{t('reward.invite.unclaimed')}</p>
        <span className="text-2xl font-bold">{c.unclaimed}</span>
        <span className="ml-2">{c.chain.symbol}</span>
      </div>

      <Button shadow="none" className="mt-2 w-full">
        {t('reward.invite.claim')}
      </Button>
    </Card>
  )
}

export default InviteReward
