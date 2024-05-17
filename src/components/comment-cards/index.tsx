import React, { ComponentProps } from 'react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { isEmpty } from 'lodash'

import { Card } from '@/components/ui/card'
import { CommentForm } from './form'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const comments = [
  {
    id: '123',
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message:
      'mf comes from a race of weed smoking aliens he was riding green candles whilst getting high. all of a sudden a pajeet hit him with a red candle and now he tryna get back to heights he reached before. help him get high and find his weed smoking buddies',
    imageUrl:
      'https://pump.mypinata.cloud/ipfs/QmeXaMn2yBXkvWYdRjwEi1DWeZY72oSTay6uta7Ugy1wLQ',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
    isLiked: true,
  },
  {
    id: '456',
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
    isLiked: true,
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: ['123'],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: ['456'],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
  {
    id: nanoid(),
    profileUrl: '/profile/9VK7SR',
    avatarUrl:
      'https://pump.fun/pepe.png?img-width=16&img-dpr=2&img-onerror=redirect',
    username: '9VK7SR (dev)',
    timestamp: '2024/5/13 11:47:08',
    message: '#2165699 mf couldnt dodge the pajeet red candle',
    imageUrl: '',
    mentions: [],
    likes: 1,
    replyTo: null,
    transactionUrl:
      'https://solscan.io/tx/5QENLPRhfCDumvnMrunZCk17GeEVBoh68sEGaKmnYrPWgAhggn8mGA2QvqEs49Ksp6gu1pjk2iVkitPZGH1fptxi',
    transactionAmount: '0.4200 SOL',
  },
]

interface Props extends ComponentProps<'div'> {
  readonly?: boolean
}

export const CommentCards = ({ readonly = false }: Props) => {
  return (
    <>
      {!readonly && <CommentForm className="mb-4" />}
      <div className="flex flex-col gap-2">
        {comments.map((c) => (
          <CommentCard key={c.id} c={c} readonly={readonly} />
        ))}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}

interface CardProps extends Pick<Props, 'readonly'> {
  c: (typeof comments)[number]
}

export const CommentCard = ({ c, readonly }: CardProps) => {
  const { t } = useTranslation()

  return (
    <Card
      key={c.id}
      id={c.id}
      className="p-4 rounded-md cursor-[unset] max-sm:p-3"
      hover="bg"
    >
      {/* User profile */}
      <div className="flex items-center gap-2 hover:text-blue-600 transition-all w-fit cursor-pointer">
        <Avatar
          src={c.avatarUrl}
          size={32}
          className="border border-zinc-400"
        />
        <div className="flex flex-col">
          <span className="text-sm">{c.username}</span>
          <span className="text-zinc-400 text-xs">
            <span>{c.timestamp}</span>
          </span>
        </div>
      </div>

      {/* Mentions */}
      {!isEmpty(c.mentions) && (
        <div className="flex items-center text-xs text-zinc-400">
          Mentions:
          {c.mentions.map((m, i) => (
            <Link key={i} className="ml-1" href={`#${m}`}>
              #{m}
            </Link>
          ))}
        </div>
      )}

      {/* Comment details */}
      <div className="">{c.message}</div>

      {/* Like, comment */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1 cursor-pointer">
          {c.isLiked ? (
            <HeartFilledIcon className="text-red-600" />
          ) : (
            <HeartIcon className="text-zinc-400" />
          )}
          <span className="text-sm mb-[0.5px]">{c.likes}</span>
        </div>
        {!readonly && (
          <Button size="xs" variant="outline">
            {t('replay')}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default CommentCards
