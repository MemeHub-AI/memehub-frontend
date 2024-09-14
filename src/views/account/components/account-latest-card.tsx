import Latest from '@/views/memex/latest'
import React from 'react'
import { FaRetweet } from 'react-icons/fa'

export const AccountLatestCard = () => {
  return (
    <div>
      <div className="align-middle text-zinc-500">
        <FaRetweet className="inline-block text-2xl" />
        <span className="ml-2 text-sm">Jack Wang Reposted</span>
      </div>
      <Latest />
    </div>
  )
}

export default AccountLatestCard
