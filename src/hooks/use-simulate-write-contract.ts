import { ConfigChainId, wagmiConfig } from '@/config/wagmi'
import { useMutation } from '@tanstack/react-query'
import { simulateContract, SimulateContractParameters } from 'wagmi/actions'

export const useSimulateWriteContract = () => {
  const {
    data,
    isPending: isSimulating,
    mutate: simulateWrite,
    mutateAsync: simulateWriteAsync,
    reset: resetSimulateWrite,
    ...mutations
  } = useMutation({
    mutationKey: ['simulateWriteContract'],
    mutationFn: (params: SimulateContractParameters) => {
      const p = { ...params, chainId: params.chainId as ConfigChainId }
      return simulateContract(wagmiConfig, p)
    },
  })

  return {
    data,
    isSimulating,
    simulateWrite,
    simulateWriteAsync,
    resetSimulateWrite,
    ...mutations,
  }
}
