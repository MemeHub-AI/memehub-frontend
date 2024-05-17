import React from 'react'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

const cards = [
  {
    name: 'unidoge',
    symbol: 'UNI',
    count: 123,
    logo: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'unidoge',
    symbol: 'UNI',
    count: 123,
    logo: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'unidoge',
    symbol: 'UNI',
    count: 123,
    logo: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'unidoge',
    symbol: 'UNI',
    count: 123,
    logo: 'https://i.pravatar.cc/150?img=1',
  },
]

export const TokenHeldCards = () => {
  return (
    <div className="grid grid-cols-3 gap-3 xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-2">
      {cards.map((c, i) => (
        <HeldCard c={c} key={i} />
      ))}
    </div>
  )
}

const HeldCard = ({ c }: { c: (typeof cards)[number] }) => {
  return (
    <Card padding="md" hover="bg">
      <div className="flex items-center gap-2">
        <Avatar src={c.logo} fallback={c.name.charAt(0)} />
        <div className="flex flex-col justify-between">
          <p className="font-bold">
            {c.name}({c.symbol})
          </p>
          <p className="text-zinc-500 text-sm">{c.count}</p>
        </div>
      </div>
    </Card>
  )
}

export default TokenHeldCards
