import React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IoMdInformationCircleOutline } from "react-icons/io";

import { useIdoContext } from '@/contexts/ido'
import { Countdown } from '@/components/countdown'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface Props {
  onExpired?: (value: boolean) => void
}

export const IdoNotStart = ({ onExpired }: Props) => {
  const { t } = useTranslation()
  const { startAt, totalReserveAmount, reserveSymbol } = useIdoContext()

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center space-x-1 mt-3">
        <span className="font-bold mr-1">{t('ido.total-amount')}:</span>
        {totalReserveAmount} {reserveSymbol}
        <IoMdInformationCircleOutline className="w-4" />
        {/* <Dialog>
          <DialogTrigger>
            <InfoIcon className="w-4" />
          </DialogTrigger>
          <DialogContent>
            <p>Waiting for fill</p>
          </DialogContent>
        </Dialog> */}
      </div>
      <div className="flex items-center space-x-1">
        <span className="font-bold mr-1"> {t('ido.start-in')}:</span>
        <Countdown
          createdAt={dayjs().unix()}
          duration={startAt - dayjs().unix()}
          onExpired={onExpired}
          className="text-black font-normal"
        />
      </div>
      <div>
        <span className="font-bold mr-1">{t('ido.eligibility')}: </span>
        {t('ido.holder-nft')}
      </div>
    </div>
  )
}

export default IdoNotStart
