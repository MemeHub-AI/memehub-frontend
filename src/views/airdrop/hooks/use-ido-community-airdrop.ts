import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'react-use'

import { idoChain } from '@/config/ido'
import { BI_ZERO } from '@/constants/number'
import { idoAirdropAbi } from '@/contract/ido/abi/airdrop'
import { v3Addr } from '@/contract/v3/address'

export const useIdoCommunityAirdrop = (enabled: boolean) => {
  const { address } = useAccount()

  const { idoAirdrop } = v3Addr[idoChain.id] ?? {}
  const airdropConfig = {
    abi: idoAirdropAbi,
    address: idoAirdrop,
    chainId: idoChain.id,
  }

  const { data: isCommunityClaimed = false, refetch: refetchIsClaimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isCommunityClaimed',
      args: [address!],
      query: { enabled: enabled && !!address },
    })

  const { data: balance = BI_ZERO, refetch: refetchBalance } = useReadContract({
    ...airdropConfig,
    functionName: 'communityPortionBalance',
    query: { enabled },
  })
  const communityBalance = balance.toString()

  const { data: totalAmount = BI_ZERO, refetch: refetchAmount } =
    useReadContract({
      ...airdropConfig,
      functionName: 'communityPortionAmount',
      query: { enabled },
    })
  const communityTotal = totalAmount.toString()
  const communityCurrent = BigNumber(communityTotal).minus(communityBalance)

  const { data: communityAmountData = BI_ZERO, refetch: refetchPerAmount } =
    useReadContract({
      ...airdropConfig,
      functionName: 'perCommunityAirdropAmount',
      query: { enabled },
    })
  const communityAmount = formatEther(communityAmountData)

  const { data: { value = BI_ZERO } = {} } = useBalance({
    address,
    chainId: idoChain.id,
  })
  const reserveBalance = formatEther(value)

  const { data: threshold = BI_ZERO, refetch: refetchThreshold } =
    useReadContract({
      ...airdropConfig,
      functionName: 'communityBnbThreshold',
      query: { enabled },
    })
  const communityThreshold = formatEther(threshold)
  const isBelowThreshold = BigNumber(reserveBalance).lt(communityThreshold)

  const refetchCommunityAirdrop = () => {
    refetchIsClaimed()
    refetchBalance()
    refetchAmount()
    refetchPerAmount()
    refetchThreshold()
  }

  useInterval(refetchCommunityAirdrop, 10_000)

  return {
    communityBalance,
    communityTotal,
    communityCurrent,
    communityAmount,
    communityThreshold,
    isCommunityClaimed,
    isBelowThreshold,
    refetchCommunityAirdrop,
  }
}
