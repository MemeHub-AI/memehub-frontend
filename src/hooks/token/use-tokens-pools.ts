import { useReadContracts } from 'wagmi'
import { Address } from 'viem'

import { TokenListItem } from '@/api/token/types'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useChainsStore } from '@/stores/use-chains-store'
import { getContractsEnabled } from '@/utils/contract'

export interface PoolItem {
  k: bigint
  token: bigint
  tokenReserve: bigint
  virtualTokenReserve: bigint
  ethReserve: bigint
  virtualEthReserve: bigint
  addPoolETHAmount: bigint
  graduationThreshold: Address
  creator: Address
  headmaster: Address
  maxSupply: bigint
}

export const useTokensPools = (tokens: TokenListItem[]) => {
  const { getChainId } = useChainsStore()

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    refetch: refetchPools,
  } = useReadContracts({
    contracts: tokens.map((token) => ({
      abi: bcAbiMap[token.bond_version!]!,
      address: token.bond_address as Address,
      chainId: getChainId(token.chain),
      functionName: 'getPool',
      args: [[token.contract_address as Address]],
    })),
    query: {
      enabled: getContractsEnabled(tokens, 'bond_version', 'bond_address'),
      // TODO/top: fix `@ts-ignore`, write `"strictNullChecks": true` to `tsconfig.ts`,
      // But in vain, it may not take effect.
      select: (data) =>
        // @ts-ignore
        data.flatMap(({ result }) => result) as (PoolItem | undefined)[],
      refetchInterval: 10_000,
    },
  })

  return {
    pools,
    isLoadingPools,
    refetchPools,
  }
}
