import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

import { tokenApi } from '@/api/token'
import { BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'

export const useTokenConfig = () => {
  const {
    data: {
      name: configName,
      value: configValue,
      contracts: {
        coin: [coin] = [],
        airdrop: [airdrop] = [],
        memex: [memex] = [],
      } = {},
    } = {},
    isLoading: isLoadingConfig,
    refetch: refetchConfig,
  } = useQuery({
    queryKey: [tokenApi.getConfig.name],
    queryFn: tokenApi.getConfig,
    select: ({ data }) => data,
    refetchInterval: 30_000,
  })
  const bcAddress = coin?.address as Address | undefined
  const bcVersion = coin?.version as BcVersion | undefined

  const airdropAddress = airdrop?.address as Address | undefined
  const airdropVersion = airdrop?.version as DistributorVersion | undefined

  const memexFactoryAddr = memex?.address as Address | undefined
  const memexFactoryVersion = memex?.version

  return {
    configName,
    configValue,
    bcAddress,
    bcVersion,
    airdropAddress,
    airdropVersion,
    memexFactoryAddr,
    memexFactoryVersion,

    isLoadingConfig,
    refetchConfig,
  }
}
