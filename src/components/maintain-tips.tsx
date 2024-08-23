import { useTranslation } from 'react-i18next'

import { isMaintaining } from '@/config/maintain'

export const MaintainTips = () => {
  const { t } = useTranslation()

  if (!isMaintaining) return

  return (
    <div className="bg-yellow-500 text-center max-sm:text-sm font-bold py-1 sticky top-16 z-50">
      {t('maintain-tips')}
    </div>
  )
}

export default MaintainTips
