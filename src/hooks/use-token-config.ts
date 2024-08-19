import { useMemo } from 'react'
import { groupBy, mapValues, orderBy } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

import { tokenApi } from '@/api/token'
import { BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'
import { MemexFactoryVersion } from '@/contract/abi/memex'
import { TokenConfigContract } from '@/api/token/types'

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
  const [coinContracts, airdropContracts, memexContracts] = useMemo(
    () => [
      groupOrderContracts(contracts?.coin),
      groupOrderContracts(contracts?.airdrop),
      groupOrderContracts(contracts?.memex),
    ],
    [contracts]
  )

  const getFirst = <
    V extends string = string,
    T extends string = Address
  >(contractsMap: {
    [x: string]: TokenConfigContract<string, string>[]
  }) => {
    const contracts = (contractsMap || {})[chain] || []
    const contract = contracts[0] || {}

    return contract as Partial<TokenConfigContract<T, V>>
  }

  const [
    { address: bcAddress, version: bcVersion },
    { address: airdropAddress, version: airdropVersion },
    { address: memexFactoryAddr, version: memexFactoryVersion },
  ] = useMemo(
    () => [
      getFirst<BcVersion>(coinContracts),
      getFirst<DistributorVersion>(airdropContracts),
      getFirst<MemexFactoryVersion>(memexContracts),
    ],
    [chain]
  )

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
