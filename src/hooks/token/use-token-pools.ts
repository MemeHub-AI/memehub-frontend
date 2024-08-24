import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { useReadContracts } from 'wagmi'
import { Address, formatEther, zeroAddress } from 'viem'
import { isEmpty } from 'lodash'

import { TokenListItem } from '@/api/token/types'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { useChainsStore } from '@/stores/use-chains-store'
import { BI_ZERO } from '@/constants/number'

interface PooledTokens extends TokenListItem {
  progress: string
  maxSupply: string
  isGraduated: boolean
}

export const useTokenPools = (tokens: TokenListItem[]) => {
  const { chainsMap } = useChainsStore()

  const enabled = useMemo(() => {
    const versions = tokens.map((t) => t.bond_version).filter(Boolean)
    const addresses = tokens.map((t) => t.bond_address).filter(Boolean)

    return (
      tokens.length === versions.length && tokens.length === addresses.length
    )
  }, [tokens])

  const { data: supplies = [] } = useReadContracts({
    contracts: tokens.map((token) => ({
      abi: bcAbiMap[token.bond_version!],
      address: token.bond_address as Address,
      chainId: +chainsMap[token.chain]!.id,
      functionName: 'maxSupply_',
    })),
    query: {
      enabled,
      select: (data) => data.map(({ result }) => result || BI_ZERO),
    },
  })

  const { data: pools = [] } = useReadContracts({
    contracts: tokens.map((token) => ({
      abi: bcAbiMap[token.bond_version!]!,
      address: token.bond_address as Address,
      chainId: +chainsMap[token.chain]!.id,
      functionName: 'pools_',
      args: [token.contract_address as Address],
    })),
    query: {
      enabled,
      select: (data) => data.map(({ result }) => result || []),
    },
  })

  const getProgress = (
    supply: (typeof supplies)[number],
    pool: (typeof pools)[number]
  ) => {
    const [
      ,
      ,
      tokenLeft = BI_ZERO,
      ,
      reserveTotal = BI_ZERO,
      ,
      ,
      ,
      ,
      headmaster = zeroAddress,
    ] = pool
    const isGraduated = headmaster !== zeroAddress

    if (isGraduated) return '100.00'
    if (isGraduated && BigNumber(tokenLeft).isZero()) return '0.00'

    return BigNumber(supply)
      .minus(tokenLeft)
      .div(supply)
      .multipliedBy(100)
      .toFixed(2)
  }

  const poolTokens = useMemo(() => {
    if (isEmpty(pools) || isEmpty(supplies)) return []

    return tokens.map((token, i) => {
      const supply = supplies[i]
      const pool = pools[i]

      return {
        ...token,
        isGraduated: pool[9] !== zeroAddress,
        progress: getProgress(supply, pool),
        maxSupply: formatEther(supply),
      } as PooledTokens
    })
  }, [supplies, pools])

  return {
    poolTokens,
  }
}
