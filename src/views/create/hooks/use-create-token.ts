import { type Address } from 'viem'
import { useQuery, useMutation } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { DeployFormParams } from './use-deploy'
import { reportException } from '@/errors'
import { BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'

export const useCreateToken = () => {
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

  const {
    data: createData,
    error: createTokenError,
    isPending: isCreatingToken,
    mutateAsync: create,
  } = useMutation({
    mutationKey: [tokenApi.createToken.name],
    mutationFn: tokenApi.createToken,
  })
  const createTokenData = createData?.data

  const createToken = async (params: DeployFormParams) => {
    if (!bcAddress || !airdropAddress) return

    try {
      const { data } = await create({
        ...params,
        factory_address: bcAddress,
        airdrop_address: airdropAddress,
      })
      return data.id
    } catch (e) {
      reportException(e)
    }
  }

  return {
    configName,
    configValue,

    bcAddress,
    bcVersion,

    airdropAddress,
    airdropVersion,

    memexFactoryAddr,
    memexFactoryVersion,

    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    refetchConfig,
  }
}
