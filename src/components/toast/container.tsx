import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children: React.ReactNode
}

export const Container = ({ className, children }: Props) => {
  return (
    <div className={cn('w-full relative text-[15px]', className)}>
      {children}
    </div>
  )
}
