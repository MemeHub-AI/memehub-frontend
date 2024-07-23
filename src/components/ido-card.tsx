import React from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/card'
import { UserCoinsCreated } from '@/api/user/types'

export const IdoCard = () => {
  const { t } = useTranslation()
  const card = {
    id: 0,
    image: '/images/ido/trump.jpeg',
    address: '',
    name: 'Trump407',
    ticker: 'Trump407',
    creator: {
      id: 123123,
      name: 'dev',
      logo: '',
      wallet_address: '',
    },
    desc: t('ido.405'),
    market_cap: 0,
    total_replies: 0,
    chain: {
      id: '56',
      name: 'bsc',
      displayName: 'BNB',
      logo: '/images/bsc.svg',
    },
    status: 1,
  } as UserCoinsCreated
  const { startAt, progress } = useIdoInfo(Number(card.chain.id), card.id)

  return (
    <TokenCard
      card={card}
      isIdo
      idoCreateAt={dayjs().unix()}
      idoDuration={startAt - dayjs().unix()}
      idoProgress={progress}
    />
  )
}

export default IdoCard
