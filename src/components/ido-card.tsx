import React from 'react'
import dayjs from 'dayjs'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/token-card'
import { TokenListItem } from '@/api/token/types'
import { useChainInfo } from '@/hooks/use-chain-info'

export const IdoCard = ({ token }: { token: TokenListItem }) => {
  const { chainId } = useChainInfo(token.chain)
  const { startAt, progress } = useIdoInfo(chainId, 0)

  return (
    <TokenCard
      card={token}
      idoCreateAt={dayjs().unix()}
      idoDuration={startAt - dayjs().unix()}
      idoProgress={progress}
    />
  )
}

export default IdoCard
