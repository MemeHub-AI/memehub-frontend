import { type ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import { isAddress, isHash, zeroAddress, zeroHash } from 'viem'
import { useTranslation } from 'react-i18next'

import { NotFound } from './not-found'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showFallback?: boolean
}

export const PageFallback = ({ children, fallback, showFallback }: Props) => {
  const { t } = useTranslation()
  const { query, isReady } = useRouter()
  const addr = (query.address || query.id) as string
  const hash = query.hash as string

  const fallbackComp = useMemo(
    () =>
      fallback || (
        <NotFound
          title={t('token.invalid.token')}
          src="/images/empty.png"
          imgClass="max-w-64 max-sm:max-w-1/2"
        />
      ),
    [fallback, t]
  )
  const [isInvalidAddr, isInvalidHash] = useMemo(
    () => [
      !!addr && (addr === zeroAddress || !isAddress(addr)),
      !!hash && (hash === zeroHash || !isHash(hash)),
    ],
    [addr, hash]
  )

  if (showFallback) return fallbackComp
  if (isReady && (isInvalidAddr || isInvalidHash)) return fallbackComp

  return children
}

export default PageFallback
