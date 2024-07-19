import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from './ui/badge'

interface Props extends ComponentProps<typeof Badge> {
  showRocket: boolean
  label: string
}

export const IdoTag = ({
  showRocket = true,
  label = '100x',
  ...props
}: Partial<Props>) => {
  const { t } = useTranslation()
  return (
    <Badge variant="warning" {...props}>
      {showRocket && '🚀'} {label} {t('coin')}
    </Badge>
  )
}

export default IdoTag
