import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button'

interface Props extends React.ComponentProps<'nav'> {
  total: number
  defaultPage?: number
  onPageChange?: (page: number) => void
}

const Pagination = (props: Props) => {
  const {
    className,
    total = 2,
    defaultPage = 1,
    onPageChange,
    ...restProps
  } = props
  const [page, setPage] = React.useState(defaultPage)

  React.useEffect(() => {
    onPageChange?.(page)
  }, [page])

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...restProps}
    >
      <PaginationContent>
        {total !== 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => p - 1)}
              // disabled={isFirstPage}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          </PaginationItem>
        )}
        {Array.from({ length: total }).map((_, i) => {
          const isActive = page === i + 1
          return (
            <PaginationItem key={i}>
              <Button
                variant={isActive ? 'outline' : 'ghost'}
                className={cn('border', !isActive && 'border-transparent')}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            </PaginationItem>
          )
        })}
        {/* {total >= 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )} */}
        {/* {
          <PaginationItem>
            <Button variant="ghost" onClick={() => setPage((p) => p + 1)}>
              {lastItem}
            </Button>
          </PaginationItem>
        } */}
        {total !== 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              // disabled={isLastPage}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </nav>
  )
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

interface ExtendProps {
  showText?: boolean
}

const PaginationPrevious = ({
  className,
  showText = false,
  ...props
}: React.ComponentProps<typeof PaginationLink> & ExtendProps) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1', showText && 'pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      {showText && <span>{t('page.prev')}</span>}
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  showText = false,
  ...props
}: React.ComponentProps<typeof PaginationLink> & ExtendProps) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1', showText && 'pr-2.5', className)}
      {...props}
    >
      {showText && <span>{t('page.next')}</span>}
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
