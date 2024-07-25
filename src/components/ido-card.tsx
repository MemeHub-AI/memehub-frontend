import React from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/card'
import { UserCoinsCreated } from '@/api/user/types'

const ido = {
  id: 350,
  image:
    'https://storage.memehub.ai/memeai/txt2img-620535142-cosmicthulhu-origin.png',
  address: '0x28715e0bec1a1ea3b53ad12a17b6d62b9c759d41',

  creator: {
    id: 1,
    name: 'Bad dev',
    logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/30e638409300488c2eec8eb9aba21149f.avif',
    description: 'dev 7214',
    wallet_address: '0x7970af446b850f7db1229996fff7127795dc7214',
    like_count: 0,
    mention_count: 0,
    reward_amount: 90.884,
    inviter_count: {
      one: 0,
      two: 0,
    },
    code: '',
    inviter: {
      one: '',
      two: '',
    },
    role: {
      kol: true,
      community: true,
    },
  },
  name: 'Trump407',
  ticker: 'Trump407',
  desc: 'Unleash the cosmic horror of the ancient one, beyond human comprehension.',
  market_cap: 2522.8732394570434,
  total_replies: 0,
  chain: {
    id: '56',
    name: 'bsc',
    logo: 'https://storage.memehub.ai/chains/logo/bsc.png',
    native: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    explorer: 'https://bscscan.com',
    explorer_tx: 'https://bscscan.com/tx',
  },
  status: 3, // 3: graduated
}

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
