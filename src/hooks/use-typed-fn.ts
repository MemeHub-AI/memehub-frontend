import { useMemo, useState } from 'react'

import { ObjectLike } from '@/utils/types'
import { useIdeaClaimRefund } from '@/views/memex/hooks/use-claim-refund'

/**
 * TODO: Perhaps not limited to functions.
 *
 * Example see: {@link useIdeaClaimRefund}
 */
export const useTypedFn = <T extends ObjectLike<ObjectLike<() => void>>>(
  options: T,
  initialType?: keyof T
) => {
  const [type, setType] = useState<keyof T>(
    initialType || Object.keys(options)[0]
  )
  const functions = useMemo(() => options[type], [options, initialType, type])

  return [functions, setType] as const
}
