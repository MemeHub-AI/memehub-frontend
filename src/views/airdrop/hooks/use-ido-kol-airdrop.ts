import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'ahooks'

import { idoAirdropAbi } from '@/contract/abi/ido/airdrop'
import { addrMap } from '@/contract/address'
import { BI_ZERO } from '@/constants/number'

export const useIdoKolAirdrop = (chainId: number, enabled: boolean) => {
  const { address } = useAccount()

  const { idoAirdrop } = addrMap[chainId] ?? {}
  const airdropConfig = {
    abi: idoAirdropAbi,
    address: idoAirdrop,
    chainId,
  }

  const { data: isKolClaimed = false, refetch: refetchIsClaimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isKolClaimed',
      args: [address!],
      query: { enabled: enabled && !!address },
    })

  const { data: balance = BI_ZERO, refetch: refetchBalance } = useReadContract({
    ...airdropConfig,
    functionName: 'kolPortionBalance',
    query: { enabled },
  })
  const kolBalance = balance.toString()

  const { data: totalAmount = BI_ZERO, refetch: refetchAmount } =
    useReadContract({
      ...airdropConfig,
      functionName: 'kolPortionAmount',
      query: { enabled },
    })
  const kolTotal = totalAmount.toString()
  const kolCurrent = BigNumber(kolTotal).minus(kolBalance)

  const { data: kolAmountData = BI_ZERO, refetch: refetchPerAmount } =
    useReadContract({
      ...airdropConfig,
      functionName: 'perKolAirdropAmount',
      query: { enabled },
    })
  const kolAmount = formatEther(kolAmountData)

  const refetchKolAirdrop = () => {
    refetchIsClaimed()
    refetchBalance()
    refetchAmount()
    refetchPerAmount()
  }

  useInterval(refetchKolAirdrop, 10_000)

  return {
    kolBalance,
    kolTotal,
    kolCurrent,
    kolAmount,
    isKolClaimed,
    refetchKolAirdrop,
  }
}
