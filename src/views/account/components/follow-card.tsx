import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'
import { Button } from '@/components/ui/button'
import { FollowType } from './follow-tab'

interface ICard {
  name: string
  avatar: string
  address: string
}

interface Props extends ComponentProps<'div'> {
  type: FollowType
  card: ICard
  onButtonClick?: (type: FollowType, card: ICard) => void
}

export const FollowCard = ({ type, card, onButtonClick }: Props) => {
  const { t } = useTranslation()

  return (
    <Card className="py-2 px-3 flex items-center justify-between" hover="bg">
      <div className="flex items-center gap-2">
        <Avatar src={card.avatar} fallback={card.name.charAt(0)} />
        <div className="flex flex-col">
          <p className="font-bold">{card.name}</p>
          <p className="text-zinc-500 text-sm">{fmt.addr(card.address)}</p>
        </div>
      </div>
      <Button
        size="xs"
        variant="outline"
        onClick={() => onButtonClick?.(type, card)}
      >
        {type === FollowType.Followers
          ? `+ ${t('follow')}`
          : `- ${t('unfollow')}`}
      </Button>
    </Card>
  )
}

export default FollowCard
