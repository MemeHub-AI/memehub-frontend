import { Address, formatEther } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { tokenAbiMap, TokenVersion } from '@/contract/abi/token'
import { BI_ZERO } from '@/constants/number'
import { BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'

export const useTokenDetails = (
  tokenAddr: Address | undefined,
  chainId: number,
  version: TokenVersion
) => {
  const tokenConfig = {
    abi: tokenAbiMap[version],
    address: tokenAddr,
    chainId,
  } as const

  const {
    data: [tokenVersion, bcVersion, airdropVersion, bcAddr, airdropAddr] = [],
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      { ...tokenConfig, functionName: 'versions' },
      { ...tokenConfig, functionName: 'bondVersion' },
      { ...tokenConfig, functionName: 'distributorVersion' },
      { ...tokenConfig, functionName: 'bond' },
      { ...tokenConfig, functionName: 'distributor' },
    ],
    query: {
      select: (data) => data.map((v) => v.result),
      enabled: !!tokenAddr,
    },
  })

  const {
    data: tokenMetadata,
    isLoading: isLoadingMetadata,
    refetch: refetchMetadata,
  } = useReadContract({
    ...tokenConfig,
    functionName: 'getMetadata',
    query: { enabled: !!tokenAddr },
  })

  const { data: totalSupply = BI_ZERO } = useReadContract({
    ...tokenConfig,
    functionName: 'totalSupply',
    query: { enabled: !!tokenAddr },
  })

  const refetchDetails = () => {
    refetch()
    refetchMetadata()
  }

  return {
    tokenVersion: tokenVersion as TokenVersion | undefined,
    bcVersion: bcVersion as BcVersion | undefined,
    airdropVersion: airdropVersion as DistributorVersion | undefined,
    bcAddr: bcAddr as Address | undefined,
    airdropAddr: airdropAddr as Address | undefined,
    tokenMetadata,
    isLoadingDetails: isLoading || isLoadingMetadata,
    totalSupply: formatEther(totalSupply),
    refetchDetails,
  }
}
