import { useTranslation } from 'react-i18next'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { toast } from 'sonner'
import { CloseButton } from './close-button'
import { Container } from './container'

interface Props {
  txUrl: string
}

export const TxLoading = ({ txUrl }: Props) => {
  const { t } = useTranslation()
  return (
    <Container className="flex flex-col">
      <CloseButton></CloseButton>
      <div className="flex items-center mb-4">
        <div className="font-bold mr-2">{t('tx.submit')}</div>
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
      <div className="text-blue-600 cursor-pointer" onClick={() => open(txUrl)}>
        {t('tx')}
      </div>
    </Container>
  )
}
