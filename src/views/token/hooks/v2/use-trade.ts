import { useAccount, useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem'

import { v2ZapV1Abi } from './../../../../contract/v2/abi/zapv1'
import { v2Addr } from '@/contract/v2/address'
import { addServiceFee } from '@/utils/contract'
import { useApprove } from '@/hooks/use-approve'
import { useRouter } from 'next/router'

export const useTradeV2 = () => {
  const { query } = useRouter()
  const tokenAddr = (query.address || '') as Address
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const { approvalForAll } = useApprove()

  const buy = (amount: string) => {
    if (!address) return

    console.log('v2 buy', parseEther(amount), tokenAddr, address)
    writeContract({
      abi: v2ZapV1Abi,
      address: v2Addr[97].zapV1,
      functionName: 'mintWithEth',
      args: [tokenAddr, parseEther(amount), address],
      value: addServiceFee(amount),
    })
  }

  const sell = async (amount: string) => {
    if (!address) return

    const isApproved = await approvalForAll(tokenAddr, v2Addr[97].zapV1, amount)
    if (!isApproved) return

    console.log('v2 sell', parseEther(amount), tokenAddr, address)
    writeContract({
      abi: v2ZapV1Abi,
      address: v2Addr[97].zapV1,
      functionName: 'burnToEth',
      args: [tokenAddr, parseEther(amount), BigInt(0), address],
    })
  }

  return {
    buy,
    sell,
  }
}
