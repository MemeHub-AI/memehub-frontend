import { Address, formatEther, parseEther, parseUnits, zeroAddress } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'

import { getZapV1Config } from '@/contract/v2/config/zapv1'
import { useApprove } from '@/hooks/use-approve'
import { CONTRACT_ERR } from '@/errors/contract'
import { addSlippage, subSlippage } from '@/utils/contract'

const referral = zeroAddress

export const useInternelTradeV2 = () => {
  const { address, chainId } = useAccount()
  const {
    data: internalHash,
    isPending: isInternalTrading,
    writeContract,
    reset: resetInternalTrade,
  } = useWriteContract({
    mutation: { onError: (e) => CONTRACT_ERR.exec(e) },
  })
  const { approvalForAll } = useApprove()

  const config = getZapV1Config(chainId ?? 0)

  // Check for trade, return `false` if trade is invalid.
  const checkForTrade = () => {
    if (!address) return false
    if (!config) return false

    return true
  }

  const internalBuy = async (
    amount: string,
    value: string,
    token: Address,
    slippage: string
  ) => {
    if (!checkForTrade()) return

    console.log('v2 internal buy', {
      amount,
      value,
      slippage,
      result: formatEther(addSlippage(value, slippage)),
    })

    // We can safely use config here,
    // because `checkForTrade` already checked.
    writeContract({
      ...config!,
      functionName: 'mintWithEth',
      args: [token, parseEther(amount), address!, referral],
      // You don't need `addServiceFee`,
      // because `value` is includes service fee.
      value: addSlippage(value, slippage),
    })
  }

  const internalSell = async (
    amount: string,
    value: string,
    token: Address,
    slippage: string
  ) => {
    if (!checkForTrade()) return

    // We can safely use config here,
    // because `checkForTrade` already checked.
    const isApproved = await approvalForAll(token, config!.address, amount)
    if (!isApproved) return

    console.log('v2 internal sell', {
      amount,
      value,
      slippage,
      result: formatEther(subSlippage(value, slippage)),
    })
    writeContract({
      ...config!,
      functionName: 'burnToEth',
      args: [
        token,
        parseEther(amount),
        addSlippage(amount, slippage),
        address!,
        referral,
      ],
    })
  }

  return {
    internalHash,
    isInternalTrading,
    internalBuy,
    internalSell,
    resetInternalTrade,
  }
}
