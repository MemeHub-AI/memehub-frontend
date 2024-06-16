import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Img } from '@/components/img'
import CustomSuspense from '@/components/custom-suspense'

const percent = 30

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

export const InviteReward = () => {
  const { t } = useTranslation()

  return (
    <>
      <h2 className="text-xl font-bold !mt-6">{t('reward.invite')}</h2>
      <p className="mt-1 mb-3">
        {t('reward.invite-desc').split('$')[0]}
        <span className="text-blue-600 font-bold text-xl">{percent}%</span>
        {t('reward.invite-desc').split('$')[1]}
      </p>

      <CustomSuspense
        isPending={false}
        fallback={<>Waiting for fill</>}
        container="div"
        className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
