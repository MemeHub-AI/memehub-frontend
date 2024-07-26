import React from 'react'
import dayjs from 'dayjs'

import { useIdoInfo } from '@/views/ido/hooks/use-ido-info'
import { TokenCard } from './token-cards/card'
import { idoTrumpCard } from '@/config/ido'
import { useIdoProgress } from '@/views/ido/hooks/use-ido-progress'

export const IdoCard = () => {
  const { chain, id } = idoTrumpCard
  const { startAt } = useIdoInfo(Number(chain.id), id)
  const { progress } = useIdoProgress(Number(chain.id), id)

  return (
    <TokenCard
      card={idoTrumpCard}
      idoCreateAt={dayjs().unix()}
      idoDuration={startAt - dayjs().unix()}
      idoProgress={progress}
    />
  )
}

export default IdoCard
