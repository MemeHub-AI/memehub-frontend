import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { MarketType, Marketing, TokenConfigRes } from '@/api/token/types'
import { reportException } from '@/errors'
import { tokenApi } from '@/api/token'
import { AirdropType } from '@/constants/airdrop'

const distributorParams = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  kolFlag: AirdropType.None,
  CommunityFlag: AirdropType.None,
  flag: [] as bigint[],
}

export const useAirdropParams = () => {
  const { t } = useTranslation()
  const { isPending, mutateAsync } = useMutation({
    mutationKey: [tokenApi.getConfig.name],
    mutationFn: tokenApi.getConfig,
  })

  const updateParams = (
    kol: Marketing | undefined,
    cmnt: Marketing | undefined,
    {
      distributionRatioKol,
      walletCountKol,
      distributionRatioCommunity,
      walletCountCommunity,
    }: TokenConfigRes['value']
  ) => {
    const params = { ...distributorParams }

    if (kol) {
      params.isDistribution = true
      params.distributionRatioKol = distributionRatioKol * 100
      params.walletCountKol = walletCountKol
      params.kolFlag = AirdropType.All
    }
    if (cmnt) {
      params.isDistribution = true
      params.distributionRatioCommunity = distributionRatioCommunity * 100
      params.walletCountCommunity = walletCountCommunity
      params.CommunityFlag = AirdropType.All
    }

    return params
  }

  const getEvmParams = async (
    chain: string,
    marketing: Marketing[] | undefined
  ) => {
    const kol = marketing?.find((m) => m.type === MarketType.Kol)
    const cmnt = marketing?.find((m) => m.type === MarketType.Community)

    // No selelct airdrop.
    if (!marketing || (!kol && !cmnt)) {
      return {
        configure: '',
        distributorParams,
      }
    }

    try {
      const { data } = await mutateAsync()
      if (data.value) {
        return {
          configure: data.name,
          distributorParams: updateParams(kol, cmnt, data.value),
        }
      }

      toast.error(t('airdrop.error.config-not-found'))
      throw new Error(t('airdrop.error.config-not-found'))
    } catch (e) {
      reportException(e)
      return {}
    }
  }

  return {
    distributorParams,
    isPending,
    getEvmParams,
  }
}
