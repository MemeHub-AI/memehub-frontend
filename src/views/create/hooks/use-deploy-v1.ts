import { Config, useAccount } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { WriteContractMutate } from 'wagmi/query'

import type { DeployParams } from './use-deploy'
import { v1FactoryAbi } from '../../../contract/v1/abi/factory'
import { v1Addr } from '@/contract/v1/address'
import { v1FactoryParams } from '@/contract/v1/config/factory'
import { commonAddr } from '@/contract/address'

/** Depreacted */
export const useDeployV1 = (
  writeContract: WriteContractMutate<Config, unknown>
) => {
  const { t } = useTranslation()
  const { chainId } = useAccount()

  const deployV1 = ({ name, ticker, onSuccess }: DeployParams) => {
    if (!chainId) return

    const id = chainId as keyof typeof commonAddr
    const { reserveToken, router } = commonAddr[id]
    if (isEmpty(reserveToken) || isEmpty(router)) {
      toast.error(t('chain.empty'))
      return
    }

    const address = v1Addr.factory[chainId as keyof typeof v1Addr.factory]
    if (isEmpty(address)) {
      toast.error(t('addr.empty'))
      return
    }

    return writeContract(
      {
        abi: v1FactoryAbi,
        address,
        functionName: 'deploy',
        args: [
          v1FactoryParams.reserveRatio,
          reserveToken,
          name,
          ticker,
          router,
        ],
        // value: DEPLOY_FEE.v1,
      },
      { onSuccess }
    )
  }

  return {
    deployV1,
  }
}
