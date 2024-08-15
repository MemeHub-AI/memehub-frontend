import { type ComponentProps } from 'react'
import { MdContentCopy } from 'react-icons/md'
import { IoCheckmark } from 'react-icons/io5'

import { useClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'

export const CopyIcon = ({
  className,
  size,
  content,
  onClick,
  ...props
}: ComponentProps<'button'> & { size?: number; content?: string }) => {
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
        <MdContentCopy className="w-full h-full" />
      )}
    </button>
  )
}

export default CopyIcon
