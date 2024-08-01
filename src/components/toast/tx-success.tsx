import { useTranslation } from 'react-i18next'
import { Container } from './container'
import BigNumber from 'bignumber.js'
import { CloseButton } from './close-button'
import { useUserStore } from '@/stores/use-user-store'
import { useAccount } from 'wagmi'
import { userApi } from '@/api/user'
import { DiamondIcon } from './diamond-icon'

interface Props {
  isBuy: boolean
  txUrl: string
  tokenAmount: string
  nativeTokenAmount: string
  diamondQuantity: number
  toastId: string | number
}

export const TxSuccess = (props: Props) => {
  const {
    toastId,
    isBuy,
    nativeTokenAmount,
    tokenAmount,
    txUrl,
    diamondQuantity,
  } = props
  const { t } = useTranslation()
  const isZero = BigNumber(diamondQuantity).lte(0)
  const { setUserInfo } = useUserStore()
  const { address } = useAccount()

  const onEnd = async () => {
    try {
      const { data } = await userApi.getOtherInfo(address!)
      setUserInfo(data)
    } catch {}
  }
  return (
    <Container>
      <CloseButton toastId={toastId}></CloseButton>
      <div className="font-bold mr-2">{t('tx.success')}</div>
      <div className="my-1">
        {isBuy ? t('buy.toast') : t('sell.toast')}{' '}
        {isBuy ? nativeTokenAmount : tokenAmount} for{' '}
        {isBuy ? tokenAmount : nativeTokenAmount}
      </div>
      {!isZero ? (
        <div className="flex items-center gap-1 mb-1">
          {t('acquired')}
          <span className="text-blue-600 text-xl">
            {BigNumber(diamondQuantity).toFormat()}
          </span>
          <div className="relative">
            <img
              src="/images/reward/diamond-star.png"
              alt="diamon"
              className="w-[25px] h-[25px]"
            />
            {!isZero && (
              <>
                <DiamondIcon isZero={isZero} onEnd={onEnd} />
                <DiamondIcon isZero={isZero} delay={0.05} />
                <DiamondIcon isZero={isZero} delay={0.1} />
                <DiamondIcon isZero={isZero} delay={0.15} />
                <DiamondIcon isZero={isZero} delay={0.2} />
              </>
            )}
          </div>
        </div>
      ) : null}
      <span
        className="text-blue-600 cursor-pointer"
        onClick={() => open(txUrl)}
      >
        {t('tx')}
      </span>
    </Container>
  )
}
