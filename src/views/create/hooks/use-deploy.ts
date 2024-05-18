import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { simulateContract } from '@wagmi/core'
import { useEffect } from 'react'
import { first } from 'lodash'

import { type TokenNewReq, TokenUpdateStatus } from '@/api/token/types'

import { factoryConfig } from './../../../contract/factory'
import { wagmiConfig } from '@/config/wagmi'
import { toastNoReject } from '@/utils/contract'
import { useToken } from './use-token'

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
  const { data, isSuccess, isLoading, isError } = useWaitForTransactionReceipt({
    hash,
  })
  const { create, update } = useToken()
  const contractAddr = first(data?.logs)?.address

  if (isLoading) {
    toast.loading(t('deploying'))
  }

  if (isSuccess || isError) {
    // reset()
    toast.dismiss()
  }

  useEffect(() => {
    if (!isSuccess) return

    update({
      address: contractAddr!,
      hash: hash!,
      status: TokenUpdateStatus.Success,
    })
  }, [isSuccess])

  const deploy = async (params: TokenNewReq) => {
    // Submit info to api. if create success then modify else remove.
    create(params)
    try {
      await writeContractAsync({
        ...factoryConfig,
        functionName: 'deploy',
        args: [
          reserveRatio,
          reserveTokenAddress,
          params.name,
          params.ticker,
          router,
        ],
        value: BigInt(deployFee),
      })

      toast.success(t('submit.success'))
    } catch (e) {
      update({ address: '', hash: '', status: TokenUpdateStatus.Failed })
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
    contractAddr,
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
