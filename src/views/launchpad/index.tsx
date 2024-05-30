import { Button } from '@/components/ui/button'
import HotNewsAside from '../main/components/aside'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Input from '@/components/input'
import CopyToClipboard from 'react-copy-to-clipboard'
import { toast } from 'sonner'
import { fmt } from '@/utils/fmt'
import { IoCopyOutline } from 'react-icons/io5'
import { Countdown } from './components/countdown'
import { useLaunchpad } from './hooks/use-launchpad'
import { formatEther, zeroAddress } from 'viem'
import { Fragment } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { useAccount } from 'wagmi'

const Launchpad = () => {
  const { t } = useTranslation()
  const { back } = useRouter()
  const { address } = useAccount()
  const {
    value,
    info,
    minBnb,
    maxBnb,
    total,
    current,
    paid,
    max,
    buyEndTime,
    isEndBuy,
    buyStartTime,
    isNotStart,
    isWhite,
    isEndWhitelist,
    isConnected,
    whitelistEndTime,
    claimAmountOneBNBOnwhitelist,
    claimAmountOneBNB,
    valueClaimAmount,
    paidClaimAmountValue,
    onClick,
    onChange,
    onMax,
    onClaim,
    setValue,
    handleButtonText,
    handleButtonDisabled,
  } = useLaunchpad()

  const hadnleBuyAndClaim = () => {
    if ((info?.isWhite && !isWhite) || !isConnected) {
      return (
        <Fragment>
          <Progress
            value={(current / total) * 100}
            className="!rounded-xl !h-[10px] mb-1"
          />
          <div className="mb-4 flex justify-between text-sm">
            <span>{current}BNB</span>
            <span>{total}BNB</span>
          </div>

          {/* Minimum Participation $1 BNB, Maximum Participation $2 BNB */}
          {/* 最少参与$1BNB，最多参与$2BNB */}
          <div className="mt-1">
            {t('purchase.number.min')}
            <span className="text-orange-500">{minBnb}BNB</span>
          </div>
          <div className="mt-1">
            {t('purchase.number.max')}
            <span className="text-orange-500">{maxBnb}BNB</span>
          </div>
          {isConnected ? (
            <div className="text-sm text-red-500 my-5">{t('not.eligible')}</div>
          ) : (
            <Button
              variant="default"
              className="my-5 px-20 py-5"
              onClick={onClick}
            >
              {t('connect.wallet')}
            </Button>
          )}
        </Fragment>
      )
    }

    if (isNotStart) {
      return (
        <Fragment>
          <div className="text-center mb-2">{t('not.start')}</div>
          <Countdown time={buyStartTime} className="mb-5"></Countdown>
        </Fragment>
      )
    }

    if (info?.isFailed) {
      return (
        <div className="text-center mb-6 text-red-500">
          {t('presale.failed')}
        </div>
      )
    }

    if (info?.isClaimActive) {
      return (
        <Fragment>
          <div className="mt-1">
            {t('participated')}{' '}
            <span className="text-orange-500">{paid}BNB</span>{' '}
            {t('participated.to')}{' '}
            <span className="text-orange-500">
              {BigNumber(valueClaimAmount).toFormat()}Trump
            </span>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <Progress
          value={(current / total) * 100}
          className="!rounded-xl !h-[10px] mb-1"
        />
        <div className="mb-4 flex justify-between text-sm">
          <span>{current}BNB</span>
          <span>{total}BNB</span>
        </div>

        {max === 0 && info?.isBuyActive ? null : (
          <>
            <div className="flex justify-between my-1">
              <div className="">
                {t('minimu.purchase')}
                <span className="text-orange-500">{`${minBnb}BNB`}</span>
              </div>
              <div className="">
                {t('maximu.purchase')}
                <span className="text-orange-500">{`${maxBnb}BNB`}</span>
              </div>
            </div>
            <Input
              value={value}
              type="number"
              onChange={({ target }) => setValue(target.value)}
              onBlur={({ target }) => onChange(target.value)}
              endIcon={
                <div
                  className="text-orange-500 text-nowrap cursor-pointer mx-3"
                  onClick={onMax}
                >
                  {t('max')}
                </div>
              }
            ></Input>
            {+value ? (
              <div className="mt-1">
                {t('participate')}{' '}
                <span className="text-orange-500">{value}BNB</span>{' '}
                {t('participate.to')}{' '}
                <span className="text-orange-500">
                  {BigNumber(valueClaimAmount).toFormat()}Trump
                </span>
              </div>
            ) : null}
          </>
        )}
        {paid !== 0 ? (
          <div className={clsx('text-sm text-gray-500', +value ? '' : 'mt-1')}>
            {t('participartion.in')}
            <span className="text-orange-500">{paid}BNB</span>
            {t('available')}
            <span className="text-orange-500">
              {BigNumber(paidClaimAmountValue).toFormat()}Trump
            </span>
          </div>
        ) : null}
        {isConnected && !isWhite && info?.isWhite ? (
          <div className="text-sm text-red-500 mt-1">{t('not.eligible')}</div>
        ) : null}
      </Fragment>
    )
  }

  const handleTime = () => {
    if (info?.isWhite && !isEndWhitelist) {
      return (
        <Fragment>
          <div className="mb-2 text-center">{t('whitelist.close.presale')}</div>
          <Countdown time={whitelistEndTime} className="mb-5"></Countdown>
        </Fragment>
      )
    }

    if (!isEndBuy) {
      return (
        <Fragment>
          <div className="mb-2 text-center">{t('close.presale')}</div>
          <Countdown time={buyEndTime} className="mb-5"></Countdown>
        </Fragment>
      )
    }
  }

  const handleShowButton = () => {
    if (isNotStart || info?.isFailed) {
      return <></>
    }

    if (info?.isWhite && !isWhite) {
      return <></>
    }

    return (
      <Button
        variant="default"
        className="my-5 px-20 py-5"
        onClick={onClick}
        disabled={handleButtonDisabled()}
      >
        {handleButtonText()}
      </Button>
    )
  }

  return (
    <main className="px-8 pb-3 max-sm:px-4">
      <div className="my-6 flex items-center">
        <h1 className="text-2xl font-bold">Launchpad Trump</h1>
      </div>
      <div className="flex max-sm:w-full">
        <HotNewsAside></HotNewsAside>
        <div className="ml-5 max-sm:ml-0  max-sm:w-full">
          <Card
            className="relative w-[450px] max-sm:w-full px-5"
            shadow={'none'}
            hover={'none'}
          >
            <div className="absolute top-2 right-2 px-2 bg-slate-200 rounded-md">
              {fmt.addr(address)}
            </div>
            <div className="text-center text-2xl mt-5 mb-3">Trump🔥</div>
            {handleTime()}
            {hadnleBuyAndClaim()}
            {handleShowButton()}
          </Card>
          <Card
            className="w-[450px] max-sm:w-full mt-5 py-3 px-5"
            shadow={'none'}
            hover={'none'}
          >
            <div className="flex justify-between">
              <span>{t('ca')}</span>
              <CopyToClipboard
                text={info?.token ?? zeroAddress}
                onCopy={() => {
                  toast.success(t('copy.success'))
                }}
              >
                <div className="flex items-center cursor-pointer text-primary">
                  {fmt.addr(info?.token ?? zeroAddress)}
                  <IoCopyOutline className="ml-1"></IoCopyOutline>
                </div>
              </CopyToClipboard>
            </div>
            <div className="!my-2 h-[1px] w-full bg-slate-100"></div>
            <div className="flex justify-between">
              <span>{t('rate')}</span>
              <span>1BNB = {BigNumber(claimAmountOneBNB).toFormat()}Trump</span>
            </div>
            <div className="!my-2 h-[1px] w-full bg-slate-100"></div>
            <div className="flex justify-between">
              <span>{t('rate.whitelist')}</span>
              <span>
                1BNB = {BigNumber(claimAmountOneBNBOnwhitelist).toFormat()}Trump
              </span>
            </div>
            <div className="!my-2 h-[1px] w-full bg-slate-100"></div>
            <div className="flex justify-between">
              <span>{t('total.supply')}</span>
              <span>{t('1b')}</span>
            </div>
            {/* <div className="!my-2 h-[1px] w-full bg-slate-100"></div> */}
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Launchpad
