import { useMemo } from 'react'
import { groupBy, mapValues, orderBy } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

import { tokenApi } from '@/api/token'
import type { TokenConfigContract } from '@/api/token/types'
import type { BcVersion } from '@/contract/abi/bonding-curve'
import type { DistributorVersion } from '@/contract/abi/distributor'
import type { MemexFactoryVersion } from '@/contract/abi/memex/factory'
import type { RecommendVersion } from '@/contract/abi/recommend'
import type { TokenVersion } from '@/contract/abi/token'

const groupOrderContracts = (contracts: TokenConfigContract[] = []) => {
  if (contracts.length === 0) return {}
  if (contracts.length === 1) {
    return { [contracts[0]?.chain || '']: contracts }
  }
  return mapValues(groupBy(contracts, 'chain'), (e) =>
    orderBy(e, ['version'], 'desc')
  )
}

export const useTokenConfig = (chain: string | undefined) => {
  chain = chain || ''

  const getFirstContract = <
    V extends string = string,
    T extends string = Address
  >(
    contracts: TokenConfigContract[] = []
  ) => {
    const grouped = groupOrderContracts(contracts) || {}
    const contract = (grouped[chain] || [])[0] || {}

    return contract as Partial<TokenConfigContract<T, V>>
  }

  const {
    data: { name: configName, value: configValue, contracts } = {},
    isLoading: isLoadingConfig,
    refetch: refetchConfig,
  } = useQuery({
    queryKey: [tokenApi.getConfig.name],
    queryFn: tokenApi.getConfig,
    select: ({ data }) => data,
    refetchInterval: 30_000,
  })
  const [
    { address: bcAddress, version: bcVersion },
    { address: tokenAddress, version: tokenVersion },
    { address: airdropAddress, version: airdropVersion },
    { address: recommendAddress, version: recommendVersion },
    { address: memexFactoryAddr, version: memexFactoryVersion },
  ] = useMemo(
    () => [
      getFirstContract<BcVersion>(contracts?.bond),
      getFirstContract<TokenVersion>(contracts?.coin),
      getFirstContract<DistributorVersion>(contracts?.airdrop),
      getFirstContract<RecommendVersion>(contracts?.recommend),
      getFirstContract<MemexFactoryVersion>(contracts?.memex),
    ],
    [contracts, chain]
  )

  return {
    configName,
    configValue,

    bcAddress,
    bcVersion,
    tokenAddress,
    tokenVersion,
    airdropAddress,
    airdropVersion,
    recommendAddress,
    recommendVersion,
    memexFactoryAddr,
    memexFactoryVersion,

    isLoadingConfig,
    refetchConfig,
  }
}
