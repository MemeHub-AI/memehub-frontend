import React, { ComponentProps } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'

const ranks = [
  {
    name: 'balabala',
    address: 'So11111111111111111111111111111111111111112',
    isBc: true,
    percent: 90,
  },
  {
    name: 'uudd',
    address: 'So11111111111111111111111111111111111111112',
    isDev: true,
    percent: 2,
  },
  {
    name: 'lrlr',
    address: 'So11111111111111111111111111111111111111112',
    percent: 1,
  },
  {
    name: 'baba',
    address: 'So11111111111111111111111111111111111111112',
    percent: 0,
  },
]

export const HoldersRank = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()

  const Suffix = (r: (typeof ranks)[number]) => {
    if (r.isBc) {
      return ` 🏦 (Bonding Curve)`
    }
    if (r.isDev) {
      return ` 🤵‍♂️ (${t('dev')})`
    }

    return ''
  }

  return (
    <>
      <h3 className={cn('font-bold mb-1', className)}>{t('holders')}</h3>
      <div className="text-sm text-zinc-500">
        <ul className="flex flex-col gap-1">
          {ranks.map((r, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="hover:text-blue-600 transition-all cursor-pointer">
                {i + 1}.{' '}
                <Link
                  href="https://scrollscan.com/token/0x5300000000000000000000000000000000000004"
                  target="_blank"
                >
                  {r.name}
                </Link>
                {Suffix(r)}
              </span>
              <span>{fmt.progress(r.percent, { toFixed: 2 })}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default HoldersRank
