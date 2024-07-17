import { useMutation } from '@tanstack/react-query'
import { Address, zeroAddress } from 'viem'

import { inviteApi } from '@/api/invite'
import { useTradeSearchParams } from './use-search-params'
import { useUserStore } from '@/stores/use-user-store'

export const useInvite = () => {
  const { userInfo } = useUserStore()
  const { referralCode } = useTradeSearchParams()

  const {
    isPending: isGetting,
    mutateAsync: getInviterInfo,
    reset: resetInviterInfo,
  } = useMutation({
    mutationKey: [inviteApi.getDetail],
    mutationFn: async (code?: string) => {
      // don't check if no any code.
      if (!code && !referralCode) return Promise.resolve()

      const { data } = await inviteApi
        .getDetail(code ?? referralCode)
        .catch(() => ({ data: null }))
      return data
    },
  })

  const {
    isPending: isCanBinding,
    mutateAsync: getCanBind,
    reset: resetCanBind,
  } = useMutation({
    mutationKey: [inviteApi.getCanBind.name],
    mutationFn: async (code?: string) => {
      // don't check if no any code.
      if (!code && !referralCode) return true
      const { data } = await inviteApi
        .getCanBind({ invitationCode: code ?? referralCode })
        .catch(() => ({ data: false }))
      return data
    },
  })

  const getReferrals = async (code?: string) => {
    const { wallet_address, inviter } = (await getInviterInfo(code)) ?? {}
    const { one, two } = userInfo?.inviter ?? {}
    const parent = (one || wallet_address || zeroAddress) as Address
    const gParent = (two || inviter?.one || zeroAddress) as Address

    return [parent, gParent] as const
  }

  return {
    isGetting,
    isCanBinding,
    getInviterInfo,
    resetInviterInfo,
    getCanBind,
    resetCanBind,
    getReferrals,
  }
}
