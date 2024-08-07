import { type Address } from 'viem'
import { useQuery, useMutation } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { DeployFormParams } from './use-deploy'
import { reportException } from '@/errors'
import { BcVersion } from '@/contract/abi/bonding-curve'
import { DistributorVersion } from '@/contract/abi/distributor'

export const useCreateToken = () => {
  const {
    data: { name: configName, value: configValue, contracts } = {},
    refetch: refetchConfig,
  } = useQuery({
    queryKey: [tokenApi.getConfig.name],
    queryFn: tokenApi.getConfig,
    select: ({ data }) => data,
    refetchInterval: 30_000,
  })
  const { address: bcAddress, version: bcVersion } = contracts?.coin[0] ?? {}
  const { address: airdropAddress, version: airdropVersion } =
    contracts?.airdrop[0] ?? {}

  const {
    data: createData,
    error: createTokenError,
    isPending: isCreatingToken,
    mutateAsync: create,
  } = useMutation({
    mutationKey: [tokenApi.create.name],
    mutationFn: tokenApi.create,
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
    bcAddress: bcAddress as Address | undefined,
    airdropAddress: airdropAddress as Address | undefined,
    bcVersion: bcVersion as BcVersion | undefined,
    airdropVersion: airdropVersion as DistributorVersion | undefined,
    createTokenData,
    createTokenError,
    isCreatingToken,
    createToken,
    refetchConfig,
  }
}
