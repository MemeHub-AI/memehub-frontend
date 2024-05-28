import React, { useState, type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'
import { useTokenContext } from '@/contexts/token'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { tokenInfo } = useTokenContext()
  const [details, setDetails] = useState<ReactNode>(null)

  return (
    <div className={cn('flex gap-3 items-start mt-4', className)}>
      <Dialog
        open={!!details}
        onOpenChange={() => setDetails(null)}
        contentProps={{ className: 'p-0 break-all' }}
      >
        {details}
      </Dialog>

      <img
        src={tokenInfo?.image}
        alt="logo"
        className="w-36 h-36 object-cover rounded cursor-pointer"
        onClick={() => {
          setDetails(
            <img
              src={tokenInfo?.image}
              alt="logo"
              className="w-full object-contain"
            />
          )
        }}
      />
      <div className="break-all line-clamp-[9]">
        <div className="font-bold leading-none">
          {tokenInfo?.name}({tokenInfo?.ticker})
        </div>
        <div
          className="text-xs text-gray-400 mt-1 break-all  cursor-pointer"
          onClick={() => setDetails(<p className="p-8"> {tokenInfo?.desc}</p>)}
        >
          {tokenInfo?.desc}
        </div>
      </div>
    </div>
  )
}

export default TokenInfo
