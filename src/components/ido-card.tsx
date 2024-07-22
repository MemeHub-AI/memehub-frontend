import React from 'react'
import dayjs from 'dayjs'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/card'
import { UserCoinsCreated } from '@/api/user/types'
import { idoChainId, idoPoolId } from '@/views/ido'

const card = {
  id: 12380192830921,
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
  desc: 'Trump407',
  market_cap: 0,
  total_replies: 0,
  chain: {
    name: 'bsc',
    displayName: 'BNB',
    logo: '/images/bsc.svg',
  },
  status: 1,
} as UserCoinsCreated

export const IdoCard = () => {
  const { progress } = useIdoInfo(idoChainId, idoPoolId)

  return (
    <TokenCard
      card={card}
      idoCreateAt={dayjs().unix()}
      idoDuration={3 * 24 * 60 * 60}
      idoProgress={progress}
    />
  )
}

export default IdoCard
