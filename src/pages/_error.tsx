import { type ComponentProps, useEffect } from 'react'
import Error from 'next/error'

import { reportException } from '@/errors'

export const CustomError = ({
  statusCode,
  ...props
}: ComponentProps<typeof Error>) => {
  useEffect(() => {
    reportException({ statusCode, ...props })
  }, [statusCode, props])

  return <Error statusCode={statusCode} />
}

export default CustomError
