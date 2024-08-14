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
      description: values.description,
      image: values.image_url,
      symbol: values.symbol,
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
<<<<<<< HEAD
  console.log('data: ', data)

  // TODO: Modified after connecting to the contract
  const deployedAddr = data
=======
  // TODO: Requires back-end compatible login
  // console.log('data: ', data?.hash().toString('hex'))
  // console.log('hash data: ', data?.hash())
  // console.log('result data: ', data)
  // console.log('data: ', data)

  const deployedAddr = useMemo(() => getDeployLogsAddr(), [data])
>>>>>>> dev

  return {
    deployFee: '0.13',
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
