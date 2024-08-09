import { useContactsWrapper } from '@/hooks/ton/contracts/use-contacts-wrapper'
import { DeployFormParams } from './use-deploy'
import { useTonBocStore } from '@/stores/use-ton-boc-store'
import { useTonAddress } from '@tonconnect/ui-react'
import { useWaitForTransaction } from '@/hooks/ton/use-wait-for-transaction'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { getDeployLogsAddr } from '@/utils/contract'

export const useTvmDeploy = () => {
  const { sendCoins } = useContactsWrapper()
  const { hashBoc } = useTonBocStore()
  const userFriendlyAddress = useTonAddress()

  useEffect(() => {
    if (userFriendlyAddress === '' || hashBoc === '') return
  }, [userFriendlyAddress, hashBoc])

  const deploy = async (values: DeployFormParams) => {
    const sendCoinOptions = {
      name: values.name,
      description: values.desc,
      image: values.image,
      symbol: values.ticker,
    }

    await sendCoins(sendCoinOptions)
  }

  const {
    isPending: isSubmitting,
    error: submitError,
    reset: resetDeploy,
    mutate: tonDeploy,
  } = useMutation({
    mutationFn: deploy,
  })

  const {
    data,
    error: confirmError,
    isPending: isConfirming,
    isSuccess: isDeploySuccess,
    isError: isDeployError,
  } = useWaitForTransaction({ hash: hashBoc, address: userFriendlyAddress })
  const deployedAddr = useMemo(() => getDeployLogsAddr(), [data])

  return {
    deployFee: '0.035',
    deployHash: hashBoc,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    resetDeploy,
    deploy: tonDeploy,
  }
}
