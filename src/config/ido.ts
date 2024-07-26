import { t } from 'i18next'

import { UserCoinsCreated } from '@/api/user/types'

export const idoTrumpCard = {
  id: 0, // this is `poolId`
  image: '/images/ido/trump.jpeg',
  address: '', // token address
  name: 'Trump407',
  ticker: 'Trump407',
  desc: t('ido.405'),
  market_cap: 0,
  total_replies: 0,
  creator: {
    id: 0,
    name: '',
    logo: '',
    description: '',
    wallet_address: '',
    like_count: 0,
    mention_count: 0,
  },
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
  isIdoToken: true,
} as UserCoinsCreated
