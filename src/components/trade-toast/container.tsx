import { type ComponentProps } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { type TxStatusProps } from './tx-status'

export const Container = ({
  className,
  children,
  getToastId,
}: ComponentProps<'div'> & Pick<TxStatusProps, 'getToastId'>) => {
  return (
    <div className={cn('w-full relative text-[15px] min-h-[107px]', className)}>
      <IoCloseOutline
        size={22}
        className="absolute z-20 -right-2 -top-2 cursor-pointer text-zinc-500 hover:text-black"
        onClick={() => toast.dismiss(getToastId())}
      />
      {children}
    </div>
  )
}
