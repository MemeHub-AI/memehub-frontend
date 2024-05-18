import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { simulateContract } from '@wagmi/core'

import { factoryConfig } from './../../../contract/factory'
import { wagmiConfig } from '@/config/wagmi'
import { toastNoReject } from '@/utils/contract'

const deployFee = 2000671350000000
const deploySymbol = 'ETH'

const reserveRatio = BigInt(800000)
const reserveTokenAddress = '0x5300000000000000000000000000000000000004'
const router = '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE'

export const useDeploy = () => {
  const { t } = useTranslation()
  const {
    data: hash,
    isPending,
    writeContractAsync,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('deploying')),
      onError: () => toast.dismiss(),
      onSuccess: () => toast.dismiss(),
    },
  })
  const { isSuccess, isLoading, isError } = useWaitForTransactionReceipt({
    hash,
  })

  if (isLoading) {
    toast.loading(t('deploying'))
  }

  const deploy = async (name: string, symbol: string) => {
    try {
      await writeContractAsync({
        ...factoryConfig,
        functionName: 'deploy',
        args: [reserveRatio, reserveTokenAddress, name, symbol, router],
        value: BigInt(deployFee),
      })
      toast.success(t('submit.success'))
    } catch (e) {
      toastNoReject(e)
    }
  }

  const staticDeploy = (name: string, symbol: string) => {
    return simulateContract(wagmiConfig, {
      ...factoryConfig,
      functionName: 'deploy',
      args: [reserveRatio, reserveTokenAddress, name, symbol, router],
      value: BigInt(deployFee),
    })
  }

  const resetDeploy = () => {
    reset()
    toast.dismiss()
  }

  return {
    deployFee,
    deploySymbol,
    deployHash: hash,
    isDeploying: isPending || isLoading,
    isSuccess,
    isError,
    deploy,
    resetDeploy,
    staticDeploy,
  }
}
