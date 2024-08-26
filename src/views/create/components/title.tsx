import { type ComponentProps } from 'react'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useResponsive } from '@/hooks/use-responsive'

export const CreateTokenTitle = ({
  className,
  children,
  withBack = false,
}: ComponentProps<'h2'> & { withBack?: boolean }) => {
  const router = useRouter()
  const { isMobile } = useResponsive()

  return (
    <h2
      className={cn(
        'font-bold text-xl mb-5 relative max-sm:w-full max-sm:my-4 max-sm:text-2xl',
        className
      )}
    >
      {withBack && (
        <Button
          size="icon"
          variant={isMobile ? 'outline' : 'ghost'}
          className="absolute left-0 max-sm:left-3"
          onClick={router.back}
        >
          <ChevronLeftIcon />
        </Button>
      )}
      {children}
    </h2>
  )
}

export default CreateTokenTitle
