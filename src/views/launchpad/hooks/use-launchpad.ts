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
const witelistEndTime = '2024/6/2 23:00:00'

export const useLaunchpad = () => {
  const [value, setValue] = useState('')
  const [buyLoading, setBuyLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)

  const { t } = useTranslation()
  const { switchChainAsync } = useSwitchChain()
  const { isConnected, address, chainId } = useAccount()
  const { data: balance } = useBalance({ address })
  const walletStore = useWalletStore()

  //  IDO 信息
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
  })

  //  是否是白名单
  const { data: isWhite, isLoading: isWhiteLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isWhite',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
  })

  //  是否是购买
  const { data: isBuy, isLoading: isBuyLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isBuy',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
  })

  // 是否已领取
  const { data: isClaim, isLoading: isClaimLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'isClaim',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
  })

  //  已购买量
  const { data: paidBNB, isLoading: paidLoading } = useReadContract({
    address: idoAddress,
    abi: idoAbi,
    functionName: 'paidBnb',
    args: [address!],
    query: {
      refetchInterval: 5_000,
    },
  })

  const paid = +formatEther(BigInt(paidBNB || 0))

  //  购买代币
  const {
    writeContractAsync: buyAmount,
    data: buyHash,
    reset: resetBuyStatus,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.loading(t('buying'))
        console.log('购买中...')
        setBuyLoading(true)
      },
      onSuccess: () => {
        setBuyLoading(false)
        console.log('购买成功...')
      },
      onError: () => {
        toast.dismiss()
        setBuyLoading(false)
        console.log('购买失败...')
        resetBuyStatus()
      },
    },
  })

  //  领取
  const {
    writeContractAsync: claim,
    data: claimHash,
    reset: resetClaimStatus,
  } = useWriteContract({
    mutation: {
      onMutate: () => {
        toast.loading(t('claiming'))
        console.log('领取中...')

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

  // 等待购买
  const { isLoading: buying, isSuccess: buySuccess } =
    useWaitForTransactionReceipt({
      hash: buyHash,
    })

  // 等待领取
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

  // 如果只差0.0001就满了，但是最小参与量应该也是0.0001
  // 否则就是按照合约最小参与单位来计算

  // 最大最小参与量
  const minBnb = +formatEther(BigInt(info?.minBnb || 0))
  const maxBnb = +formatEther(BigInt(info?.maxBnb || 0))

  // 池子总量  当前量  差额
  const total = +formatEther(BigInt(info?.totalGatherBnb || 0))
  const current = +formatEther(BigInt(info?.totalPaidBnb || 0))
  const diff = BigNumber(total).minus(current).toNumber()
  const isBalanceInsufficient =
    +formatEther(BigInt(balance?.value || 0)) < minBnb

  const claimAmount = isWhite ? info?.whiteClaimAmount : info?.claimAmount

  // 最小 BNB 购买量 对应的 可领取代币量
  const minClaimAmount = +formatEther(BigInt(claimAmount || 0))

  // 一个BNB可获得的数量
  const claimAmountOneBNBOnWitelist = +BigNumber(1)
    .div(minBnb)
    .multipliedBy(+formatEther(BigInt(info?.whiteClaimAmount || 0)))
    .toFixed(2)
  const claimAmountOneBNB = +BigNumber(1)
    .div(minBnb)
    .multipliedBy(+formatEther(BigInt(info?.claimAmount || 0)))
    .toFixed(2)

  // 输入BNB对应的领取代币数量
  const valueClaimAmount = +BigNumber(+value)
    .div(minBnb)
    .multipliedBy(minClaimAmount)
    .toFixed(2)

  // 等待领取的代币数量
  const paidClaimAmountValue = +BigNumber(paid)
    .div(minBnb)
    .multipliedBy(minClaimAmount)
    .toFixed(2)

  const max = Math.min(BigNumber(maxBnb).minus(paid).toNumber(), minBnb)

  const onBuy = async () => {
    if (!isConnected) {
      return walletStore.setConnectOpen(true)
    }

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
    if (!isConnected) {
      return walletStore.setConnectOpen(true)
    }
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

    // 剩余差额小于了最小参与量，那他的参与量就不能再大于差额了，只能参与和差额一样的量
    if (diff < min) {
      if (v !== diff) {
        return setValue(`${diff}`)
      }
    } else {
      // 按照最大最小值的限定参与
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

    if (isBalanceInsufficient) {
      return t('insufficient.balance')
    }

    if (max === 0 && info?.isBuyActive) {
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
      !value.trim() ||
      +value === 0 ||
      value > formatEther(balance?.value || BigInt(0))
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

    if (isBalanceInsufficient) {
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
    if (info?.isBuyActive) {
      onBuy()
    } else if (info?.isClaimActive) {
      onClaim()
    }
  }

  useEffect(() => {
    if (isError || isLoadingError) {
      console.log('失败...')
      toast.dismiss()
      toast.error(error?.message)
      resetBuyStatus()
      resetClaimStatus()
      return
    }

    if (buySuccess) {
      console.log('buySuccess 购买成功...')
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
    witelistEndTime,
    buyStartTime,
    buyEndTime,
    isConnected,
    value,
    info,
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
    claimAmountOneBNBOnWitelist,
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
