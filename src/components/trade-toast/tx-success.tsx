import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'

import { Container } from './container'
import { DiamondIcon } from './diamond-icon'
import { useUserInfo } from '@/hooks/use-user-info'
import { TxStatusProps } from './tx-status'
import { fmt } from '@/utils/fmt'

export const TxSuccess = ({
  isBuy,
  reserveLabel,
  tokenLabel,
  txUrl,
  reward,
  getToastId,
}: TxStatusProps) => {
  const { t } = useTranslation()
  const { refetchUserInfo } = useUserInfo()
  const isZero = BigNumber(reward).lte(0)

  return (
    <Container getToastId={getToastId}>
      <div className="font-bold mr-2">{t('tx.success')}</div>
      <div className="my-1">
        {isBuy ? t('buy.toast') : t('sell.toast')}{' '}
        {isBuy ? reserveLabel : tokenLabel} for{' '}
        {isBuy ? tokenLabel : reserveLabel}
      </div>
      {!isZero && (
        <div className="flex items-center gap-1 mb-1">
          {t('acquired')}
          <span className="text-blue-600 text-xl">{fmt.decimals(reward)}</span>
          <div className="relative">
            <img
              src="/images/reward/diamond-star.png"
              alt="diamon"
              className="w-[25px] h-[25px]"
            />
            <DiamondIcon isZero={isZero} onEnd={refetchUserInfo} />
            <DiamondIcon isZero={isZero} delay={0.05} />
            <DiamondIcon isZero={isZero} delay={0.1} />
            <DiamondIcon isZero={isZero} delay={0.15} />
            <DiamondIcon isZero={isZero} delay={0.2} />
          </div>
        </div>
      )}

      <Link
        href={txUrl}
        target="_blank"
        className="text-blue-600 cursor-pointer hover:underline"
      >
        {t('tx')}
      </Link>
    </Container>
  )
}
