import { useTranslation } from 'react-i18next'
import { CloseButton } from './close-button'
import { Container } from './container'

interface Props {
  txUrl: string
}

export const SlippageError = ({ txUrl }: Props) => {
  const { t } = useTranslation()
  return (
    <Container>
      <CloseButton></CloseButton>
      <div className="font-bold">{t('tx.fail')}</div>
      <div className="flex justify-between">
        <div>
          <div className="my-2">{t('slippage.low.tips')}</div>
          <div
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              open(txUrl)
            }}
          >
            {t('tx')}
          </div>
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
