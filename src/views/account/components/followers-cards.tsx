import React from 'react'

import FollowCard from './follow-card'
import { FollowType } from './follow-tab'

const cards = [
  {
    name: 'limtime1',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: 'asdjawodjioasjdioawjiodjawiodjiaw',
  },
  {
    name: 'limtime2',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: 'asdjawodjioasjdioawjiodjawiodjiaw',
  },
  {
    name: 'limtime3',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: 'asdjawodjioasjdioawjiodjawiodjiaw',
  },
]

export const FollowersCards = () => {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((c, i) => (
        <FollowCard type={FollowType.Followers} card={c} key={i} />
      ))}
    </div>
  )
}

export default FollowersCards
