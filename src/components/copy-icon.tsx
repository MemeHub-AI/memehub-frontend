import { type ReactNode, type ComponentProps } from 'react'
import { MdContentCopy } from 'react-icons/md'
import { IoCheckmark } from 'react-icons/io5'

import { useClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'

interface Props {
  size?: number
  content?: string
  icon?: ReactNode
}

export const CopyIcon = ({
  className,
  size,
  content,
  icon,
  onClick,
  ...props
}: ComponentProps<'button'> & Props) => {
  const { isCopied, copy } = useClipboard()

  return (
    <button
      style={{ width: size, height: size }}
      className={cn('shrink-0', className)}
      onClick={(e) => {
        content && copy(content)
        onClick?.(e)
      }}
      {...props}
    >
      {isCopied ? (
        <IoCheckmark className="w-full h-full" />
      ) : (
        icon || <MdContentCopy className="w-full h-full" />
      )}
    </button>
  )
}

export default CopyIcon
