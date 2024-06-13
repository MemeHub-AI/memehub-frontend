import { useAccount, useWriteContract } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { erc20Abi, parseEther } from 'viem'

import { v2ZapV1Abi } from './../../../../contract/v2/abi/zapv1'
import { v2Addr } from '@/contract/v2/address'
import { addServiceFee } from '@/utils/contract'
import { useApprove } from '@/hooks/use-approve'
import { v2TokenAbi } from '@/contract/v2/abi/token'
import { wagmiConfig } from '@/config/wagmi'
import { BigNumber } from 'bignumber.js'

const tokenAddr = '0x2125a289aDE91aB855CbE7B66ee77d39AC8a9148'

const APPROVE_MAX_VALUE = BigInt(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
)

export const useTradeV2 = () => {
  const { address } = useAccount()
  const { writeContract, writeContractAsync } = useWriteContract()
  const { checkForApproval } = useApprove()

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

    const isApproved = await checkForApproval(
      v2Addr[97].token,
      v2Addr[97].zapV1,
      amount
    )
    console.log('isApproved', isApproved)
    if (!isApproved) return

    console.log('v2 sell', parseEther(amount), tokenAddr, address)
    writeContractAsync({
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
