import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'

import type { TokenNewReq } from '@/api/token/types'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { v2BondAbi } from '@/contract/v2/abi/bond'
import { v2Addr } from '@/contract/v2/address'
import { v2BondParams } from '@/contract/v2/params/bond'

export const useDeployV2 = () => {
  const { chainId } = useAccount()
  const {
    data: hash,
    isPending: isSubmitting,
    error: submitErr,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        console.log('submit deploy')
      },
      onError(error) {
        console.log('submit error', error)
      },
      onSuccess(data) {
        console.log('submit success', data)
      },
    },
  })

  const {
    data: confirmData,
    error: confirmErr,
    isLoading: isConfirming,
  } = useWaitForTx({
    hash,
    onError(error) {
      console.log('confirm error', error)
    },
    onSuccess(data) {
      console.log('confirm success', data)
    },
  })

  const deploy = (params: Omit<TokenNewReq, 'hash'>) => {
    const chainId = 97
    writeContract({
      abi: v2BondAbi,
      address: v2Addr.bond[chainId],
      functionName: 'createToken',
      args: [
        { name: params.name, symbol: params.ticker },
        {
          mintRoyalty: v2BondParams.mintFee,
          burnRoyalty: v2BondParams.burnFee,
          reserveToken: v2Addr.reserveTokenAddr[chainId],
          // TODO: should be dynamic?
          addLiquidityTokenAmount: parseEther('270000000'),
          addLiquidityReserveAmount: parseEther('13.5'),
          reserveTotalsupply: parseEther('14.325294685317497'),
          router: v2Addr.routerAddr[chainId],
          maxSupply: parseEther('730000000'),
          stepRanges: v2BondParams.stepRanges,
          stepPrices: v2BondParams.stepPrices,
        },
      ],
      value: v2BondParams.deployFee,
    })
  }

  return {
    hash,
    submitErr,
    confirmData,
    confirmErr,
    isSubmitting,
    isConfirming,
    isDeploying: isSubmitting || isConfirming,
    deploy,
    reset,
  }
}
