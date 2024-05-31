import { idoAbi } from '@/contract/abi/ido'
import { idoAddress } from '@/contract/address'
import { useWalletStore } from '@/stores/use-wallet-store'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { formatEther, parseEther, zeroAddress } from 'viem'
import { bscTestnet } from 'viem/chains'
import {
  useAccount,
  useBalance,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const buyEndTime = '2024/6/3 23:00:00'
const buyStartTime = '2024/5/28 23:00:00'
const whitelistEndTime = '2024/6/2 23:00:00'

export const useLaunchpad = () => {
  const [value, setValue] = useState('')
  const [buyLoading, setBuyLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)

  const { t } = useTranslation()
  const { switchChainAsync } = useSwitchChain()
  const { isConnected, address, chainId } = useAccount()
  const { data: balance } = useBalance({ address })
  const walletStore = useWalletStore()

  const {
    data: info,
    isLoading: infoLoading,
    isError,
    isLoadingError,
    error,
  } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'getInfo',
    query: {
      refetchInterval: 5_000,
    },
    chainId: bscTestnet.id,
  })

  const { data: isWhite, isLoading: isWhiteLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isWhite',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
    chainId: bscTestnet.id,
  })

  const { data: isBuy, isLoading: isBuyLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isBuy',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
    chainId: bscTestnet.id,
  })

  const { data: isClaim, isLoading: isClaimLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isClaim',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
  })

  const { data: paidBNB, isLoading: paidLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'paidBnb',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
    chainId: bscTestnet.id,
  })

  const paid = +formatEther(BigInt(paidBNB || 0))

  const {
    writeContractAsync: buyAmount,
    data: buyHash,
    reset: resetBuyStatus,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.loading(t('buying'))
        setBuyLoading(true)
      },
      onSuccess: () => {
        setBuyLoading(false)
      },
      onError: () => {
        toast.dismiss()
        setBuyLoading(false)
        resetBuyStatus()
      },
    },
  })

  const {
    writeContractAsync: claim,
    data: claimHash,
    reset: resetClaimStatus,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.loading(t('claiming'))
        setClaimLoading(true)
      },
      onSuccess: (hash) => {
        setClaimLoading(false)
      },
      onError: () => {
        toast.dismiss()
        setClaimLoading(false)
        resetClaimStatus()
      },
    },
  })

  const { isLoading: buying, isSuccess: buySuccess } =
    useWaitForTransactionReceipt({
      hash: buyHash,
    })

  const { isLoading: claiming, isSuccess: claimSuccess } =
    useWaitForTransactionReceipt({
      hash: claimHash,
    })

  const loading =
    infoLoading ||
    isBuyLoading ||
    isClaimLoading ||
    paidLoading ||
    isWhiteLoading
  const isBuying = buyLoading || buying
  const isClaiming = claimLoading || claiming

  const minBnb = +formatEther(BigInt(info?.minBnb || 0))
  const maxBnb = +formatEther(BigInt(info?.maxBnb || 0))

  const total = +formatEther(BigInt(info?.totalGatherBnb || 0))
  const current = +formatEther(BigInt(info?.totalPaidBnb || 0))
  const diff = BigNumber(total).minus(current).toNumber()
  const isBalanceInsufficient =
    +formatEther(BigInt(balance?.value || 0)) < minBnb

  console.log(info)

  const claimAmount = isWhite ? info?.whiteClaimAmount : info?.claimAmount

  const minClaimAmount = +formatEther(BigInt(claimAmount || 0))

  const claimAmountOneBNBOnwhitelist = +BigNumber(1)
    .div(minBnb)
    .multipliedBy(+formatEther(BigInt(info?.whiteClaimAmount || 0)))
    .toFixed(2)
  const claimAmountOneBNB = +BigNumber(1)
    .div(minBnb)
    .multipliedBy(+formatEther(BigInt(info?.claimAmount || 0)))
    .toFixed(2)

  const valueClaimAmount = +BigNumber(+value)
    .div(minBnb)
    .multipliedBy(minClaimAmount)
    .toFixed(2)

  const paidClaimAmountValue = +BigNumber(paid)
    .div(minBnb)
    .multipliedBy(minClaimAmount)
    .toFixed(2)

  const max = Math.min(BigNumber(maxBnb).minus(paid).toNumber(), minBnb)

  const onBuy = async () => {
    if (chainId !== bscTestnet.id) {
      try {
        toast.loading('Switching to BSC Testnet')
        await switchChainAsync({ chainId: bscTestnet.id })
      } finally {
        toast.dismiss()
      }
      return
    }

    try {
      await buyAmount({
        address: idoAddress,
        abi: idoAbi,
        functionName: 'buyAmount',
        args: [zeroAddress],
        value: parseEther(value),
        chainId: bscTestnet.id,
      })
    } catch (e: any) {
      toast.error(e?.message)
    }
  }

  const onClaim = async () => {
    try {
      await claim({
        address: idoAddress,
        abi: idoAbi,
        functionName: 'claim',
        chainId: bscTestnet.id,
      })
    } catch (e: any) {
      toast.error(e?.message)
    }
  }

  const hadnleLimitAmount = (v: number) => {
    const min = Math.min(BigNumber(maxBnb).minus(paid).toNumber(), minBnb)
    const max = Math.min(
      Math.max(BigNumber(maxBnb).minus(paid).toNumber(), v),
      maxBnb
    )

    if (diff < min) {
      if (v !== diff) {
        return setValue(`${diff}`)
      }
    } else {
      if (v < min) {
        return setValue(`${min}`)
      } else if (v > max) {
        return onMax()
      }
    }

    const residue = BigNumber(maxBnb).minus(paid).toNumber()

    if (v > residue) {
      setValue(`${residue}`)
    } else {
      setValue(`${v}`)
    }
  }

  const onMax = () => {
    const residue = BigNumber(maxBnb).minus(paid).toNumber()
    if (residue > diff) {
      return setValue(`${diff}`)
    } else {
      setValue(`${residue}`)
    }
  }

  const onChange = (value: string) => {
    const v = +value || 0
    hadnleLimitAmount(v)
  }

  const handleButtonText = () => {
    if (!isConnected) {
      return t('connect.wallet')
    }

    if (buyLoading) {
      return t('buying')
    }

    if (claimLoading) {
      return t('claiming')
    }

    if (isClaim) {
      return t('claimed')
    }

    if (info?.isBuyActive && isBalanceInsufficient) {
      return t('insufficient.balance')
    }

    if (
      (max === 0 && info?.isBuyActive) ||
      (info?.totalGatherBnb === info?.totalPaidBnb && !info?.isClaimActive)
    ) {
      return t('wait.claim')
    }

    return info?.isClaimActive ? t('claim') : t('buy')
  }

  const handleButtonDisabled = () => {
    if (!isConnected) {
      return false
    }

    if (!isWhite && info?.isWhite) {
      return true
    }

    if (
      info?.isBuyActive &&
      (!value.trim() ||
        +value === 0 ||
        value > formatEther(balance?.value || BigInt(0)))
    ) {
      return true
    }

    if (loading) {
      return true
    }

    if (isBuying) {
      return true
    }

    if (isClaiming) {
      return true
    }

    if (isClaim) {
      return true
    }

    if (info?.isBuyActive && isBalanceInsufficient) {
      return true
    }

    if (max === 0 && info?.isBuyActive) {
      return true
    }

    if (paid === 0 && info?.isClaimActive) {
      return true
    }

    return false
  }

  const onClick = () => {
    if (!isConnected) {
      return walletStore.setConnectOpen(true)
    }

    if (info?.isClaimActive) {
      onClaim()
    } else if (info?.isBuyActive) {
      onBuy()
    }
  }

  useEffect(() => {
    if (isError || isLoadingError) {
      toast.dismiss()
      toast.error(error?.message)
      resetBuyStatus()
      resetClaimStatus()
      return
    }

    if (buySuccess) {
      toast.dismiss()
      toast.success(t('buy.success'))
      resetBuyStatus()
      return
    }

    if (claimSuccess) {
      toast.dismiss()
      toast.success(t('claim.success'))
      resetClaimStatus()
    }
  }, [isError, isLoadingError, buySuccess, claimSuccess])

  return {
    isWhite,
    whitelistEndTime,
    buyStartTime,
    buyEndTime,
    isConnected,
    value,
    info,
    isEndWhitelist: new Date() > new Date(whitelistEndTime),
    isNotStart: new Date() < new Date(buyStartTime),
    isEndBuy: new Date() > new Date(buyEndTime) || !info?.isBuyActive,
    minBnb,
    maxBnb,
    total,
    current,
    max,
    paid,
    isBuy,
    isClaim,
    loading,
    isBuying,
    isClaiming,
    claimAmountOneBNB,
    claimAmountOneBNBOnwhitelist,
    valueClaimAmount,
    paidClaimAmountValue,
    balance,
    isBalanceInsufficient,
    onClick,
    setValue,
    onBuy,
    onChange,
    onMax,
    onClaim,
    handleButtonText,
    handleButtonDisabled,
  }
}
