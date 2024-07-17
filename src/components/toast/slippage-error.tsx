import { useTranslation } from 'react-i18next'
import { CloseButton } from './close-button'
import { Container } from './container'

interface Props {
  txUrl: string
  toastId: string | number
}

export const SlippageError = ({ txUrl, toastId }: Props) => {
  const { t } = useTranslation()
  return (
    <Container>
      <CloseButton toastId={toastId}></CloseButton>
      <div className="font-bold">{t('tx.fail')}</div>
      <div className="flex justify-between">
        <div>
          <div className="my-2">{t('slippage.low.tips')}</div>
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              open(txUrl)
            }}
          >
            {t('tx')}
          </span>
        </div>
        <img
          src="/images/error.png"
          alt="Error"
          className="w-[60px] h-[60px]"
        />
      </div>
    </Container>
  )
}
