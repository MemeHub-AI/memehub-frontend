import { useTranslation } from 'react-i18next'
import { TbUsers } from 'react-icons/tb'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { Card } from '@/components/ui/card'
import { Countdown } from '@/components/countdown'
import { AirdropItem } from '@/api/airdrop/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Img } from '@/components/img'
import { useAirdropInfo } from '../../../hooks/airdrop/use-airdrop-info'
import { fmt } from '@/utils/fmt'
import { useAirdropContext } from '@/contexts/airdrop'
import { utilLang } from '@/utils/lang'
import { IdTag } from '@/components/id-tag'
import { useAirdrop } from '@/views/token/hooks/evm/use-airdrop'
import { useUserStore } from '@/stores/use-user-store'
import { useChainInfo } from '@/hooks/use-chain-info'

interface Props {
  className?: string
  airdrop: AirdropItem | undefined
  detail: AirdropItem['airdrop'][number]
  isKolCard: boolean
}

export const AirdropCard = ({
  className,
  airdrop,
  detail,
  isKolCard,
}: Props) => {
  const {
    image_url,
    symbol,
    chain,
    contract_address = '',
    coin_version,
    airdrop_address,
    airdrop_version,
  } = airdrop ?? {}
  const { distribution_id } = detail
  const { t } = useTranslation()
  const { query, pathname, ...router } = useRouter()
  const { hideClaimed } = useAirdropContext()
  const { chainId, chainName } = useChainInfo(chain)

  const { isKol, hasCommunity, kolInfo, communityInfo } = useUserStore()
  const {
    createAt,
    durationSeconds,
    kolTotalAmount,
    communityTotalAmount,
    kolClaimedCount,
    kolCount,
    communityCount,
    communityClaimedCount,
  } = useAirdropInfo(distribution_id, contract_address, chainId, coin_version)

  const totalAmount = isKolCard ? kolTotalAmount : communityTotalAmount
  const current = isKolCard ? kolClaimedCount : communityClaimedCount
  const total = isKolCard ? kolCount : communityCount

  const { isKolClaimed, isCommunityClaimed } = useAirdrop(
    distribution_id,
    airdrop_address,
    airdrop_version,
    chainId
  )
  const isClaimed = isKolCard ? isKolClaimed : isCommunityClaimed

  const onClaim = () => {
    router.push({
      pathname: fmt.toHref(chainName, contract_address),
      query,
    })
  }

  if (hideClaimed && isClaimed) return

  return (
    <Card
      className={cn('p-3 max-sm:w-[96vw] max-w-[450px]', className)}
      shadow="none"
      onClick={onClaim}
    >
      <div className="flex justify-between">
        <span className="font-bold truncate">
          {airdrop?.symbol}({airdrop?.name})
        </span>
        <Countdown createdAt={createAt} duration={durationSeconds} />
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div>
          {(isKolCard && !isKol) || (!isKolCard && !hasCommunity) ? (
            <p className="text-zinc-500 font-semibold leading-10">
              {utilLang.replace(t('airdrop.not-nft2'), [
                isKol ? 'KOL' : t('pure.community'),
              ])}
            </p>
          ) : (
            <IdTag
              src={isKolCard ? kolInfo?.logo : communityInfo?.logo}
              title={
                isKolCard
                  ? kolInfo?.name
                  : fmt.withCommunity(utilLang.locale(communityInfo?.name))
              }
              containerClass="w-[150px]"
            />
          )}
          <div className="mt-3 flex items-center">
            <img src="/images/gift.png" alt="gift" className="w-6 h-6" />
            <span className="ml-2 text-gray-500 break-all line-clamp-1">
              {BigNumber(totalAmount ?? 0).toFormat()} {symbol}
            </span>
          </div>
          <div className="mt-3 flex items-center text-gray-500">
            <TbUsers size={20} />
            <span className="ml-2">
              {BigNumber(current).toFormat()} / {BigNumber(total).toFormat()}
            </span>
          </div>
          <Button
            className="mt-3 font-bold w-full"
            disabled={isClaimed}
            onClick={onClaim}
          >
            {isClaimed ? t('airdrop.claimed') : t('claim.airdrop')}
          </Button>
        </div>
        <Img src={image_url} className="w-40 h-40 max-sm:!w-[38%] " />
      </div>
    </Card>
  )
}
