import React from 'react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'

const cards = [
  {
    username: 'limtime',
    content: 'hahahha',
    mention: 312321,
  },
  {
    username: 'limtime',
    content: 'hahahha',
    mention: 312321,
  },
  {
    username: 'limtime',
    content: 'hahahha',
    mention: 312321,
  },
  {
    username: 'limtime',
    content: 'hahahha',
    mention: 312321,
  },
]

export const MentionCards = () => {
  return (
    <div className="flex flex-col gap-3 max-sm:gap-2">
      {cards.map((c, i) => (
        <MentionCard key={i} c={c} />
      ))}
    </div>
  )
}

const MentionCard = ({ c }: { c: (typeof cards)[number] }) => {
  const { t } = useTranslation()

  return (
    <Card padding="md" className="flex items-center gap-3" hover="bg">
      <ChatBubbleIcon width={20} height={20} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-black hover:underline">
            {c.username}
          </span>
          <span className="text-zinc-500 max-sm:text-xs">
            {t('comment.mention-you')}:
          </span>
          <span className="max-sm:text-sm">#{c.mention}</span>
        </div>
        <p>{c.content}</p>
      </div>
    </Card>
  )
}

export default MentionCards
