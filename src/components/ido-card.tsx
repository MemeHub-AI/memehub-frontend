import React from 'react'
import dayjs from 'dayjs'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/card'
import { TokenListItem } from '@/api/token/types'
import { useChainsStore } from '@/stores/use-chains-store'

export const IdoCard = ({ token }: { token: TokenListItem }) => {
  const { chainsMap } = useChainsStore()
  const { startAt, progress } = useIdoInfo(
    Number(chainsMap[token.chain]?.id ?? 0),
    token.airdrop_index ?? 0
  )

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
