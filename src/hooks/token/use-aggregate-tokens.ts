import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { useReadContracts } from 'wagmi'
import { Address, zeroAddress } from 'viem'
import { isEmpty } from 'lodash'

import { TokenListItem } from '@/api/token/types'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useChainsStore } from '@/stores/use-chains-store'
import { BI_ZERO } from '@/constants/number'

type Pools = [
  `0x${string}`,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  `0x${string}`,
  `0x${string}`
]

interface AggregatedToken extends TokenListItem {
  progress: string
  maxSupply: string
  isGraduated: boolean
}

export const useAggregateTokens = (tokens: TokenListItem[]) => {
  const { chainsMap } = useChainsStore()

  const enabled = useMemo(() => {
    const versions = tokens.map((t) => t.bond_version).filter(Boolean)
    const addresses = tokens.map((t) => t.bond_address).filter(Boolean)

    return (
      tokens.length === versions.length && tokens.length === addresses.length
    )
  }, [tokens])

  const { data: pools = [] } = useReadContracts({
    allowFailure: true,
    contracts: tokens.map((token) => ({
      abi: bcAbiMap[token.bond_version!]!,
      address: token.bond_address as Address,
      chainId: Number(chainsMap[token.chain]?.id || 0),
      functionName: 'pools_',
      args: [token.contract_address as Address],
    })),
    query: {
      enabled,
      // TODO/top: fix `@ts-ignore`, write `"strictNullChecks": true` to `tsconfig.ts`,
      // But in vain, it may not take effect.
      // @ts-ignore
      select: (data) => data.map(({ result }) => result || []) as Pools[],
      refetchInterval: 10_000,
    },
  })

  const getProgress = (
    tokenLeft: string,
    maxSupply: string,
    isGraduated: boolean
  ) => {
    if (isGraduated) return '100'
    if (isGraduated && BigNumber(tokenLeft.toString()).isZero()) return '0'

    const percent = BigNumber(maxSupply)
      .minus(tokenLeft.toString())
      .div(maxSupply)
      .multipliedBy(100)

    return percent.lte(0) || percent.isNaN() ? '0' : percent.toFixed(2)
  }

  const aggregatedTokens = useMemo(() => {
    if (isEmpty(pools)) return []
    return tokens.map((token, i) => {
      const [
        ,
        ,
        tokenLeft = BI_ZERO,
        ,
        ,
        ,
        ,
        ,
        ,
        headmaster = zeroAddress,
        maxSupply = BI_ZERO,
      ] = pools[i]
      const isGraduated = headmaster !== zeroAddress
      const progress = getProgress(
        tokenLeft.toString(),
        maxSupply.toString(),
        isGraduated
      )

      return {
        ...token,
        isGraduated,
        progress,
      } as AggregatedToken
    })
  }, [pools])

  return {
    aggregatedTokens,
  }
}
