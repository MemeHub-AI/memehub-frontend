import { useTranslation } from 'react-i18next'

import { TokenListItem } from '@/api/token/types'
import { Badge } from '../ui/badge'

const classes = 'absolute left-0 top-0 rounded-l-none rounded-tr-none mr-2'

export const TokenCardBadge = ({
  token,
  isGraduated,
}: {
  token: TokenListItem
  isGraduated: boolean
}) => {
  const { t } = useTranslation()

  if (isGraduated) {
    return (
      <Badge variant="success" className={classes}>
        {t('token.graduated')}
      </Badge>
    )
  }

  if (!token.is_active) {
    return (
      <Badge variant="destructive" className={classes}>
        {t('token.inactive')}
      </Badge>
    )
  }

  if (token.coin_type === 6 && !isGraduated) {
    return (
      <Badge variant="success" className={classes}>
        {t('token.memex')}
      </Badge>
    )
  }
}

export default TokenCardBadge
