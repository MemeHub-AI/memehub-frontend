import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { useSize } from 'ahooks'

import { cn } from '@/lib/utils'

interface Props {
  maxLine?: number
  showMoreClass?: string
  disableClickShowMore?: boolean
}

const lineClampBase = 'line-clamp-5'

export const EllipsisText = ({
  className,
  maxLine = 5,
  showMoreClass,
  children,
  disableClickShowMore,
  ...props
}: ComponentProps<'div'> & Props) => {
  const { t } = useTranslation()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)
  const [lineClampClass, setLineClampClass] = useState(lineClampBase)
  const { width } = useSize(document.querySelector('body')) ?? {}

  useEffect(() => {
    if (!contentRef.current) return
    const { scrollHeight, clientHeight } = contentRef.current

    setIsOverflowed(scrollHeight > clientHeight)
  }, [contentRef.current, width, maxLine, children])

  return (
    <>
      <div
        style={{ WebkitLineClamp: maxLine }}
        className={cn(
          'break-all whitespace-pre-line',
          lineClampClass,
          className
        )}
        ref={contentRef}
        {...props}
      >
        {children}
      </div>

      {isOverflowed && (
        <p
          className={cn(
            'text-blue-600 cursor-pointer sm:hover:underline active:underline',
            showMoreClass
          )}
          onClick={() => {
            if (disableClickShowMore) return
            setLineClampClass((cls) => (isEmpty(cls) ? lineClampBase : ''))
          }}
        >
          {isEmpty(lineClampClass) ? t('show-less') : t('show-more')}
        </p>
      )}
    </>
  )
}

export default EllipsisText
