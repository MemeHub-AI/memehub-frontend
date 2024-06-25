import { useMutation, useQuery } from '@tanstack/react-query'

import { inviteApi } from '@/api/invite'
import { useUserStore } from '@/stores/use-user-store'
import { useTradeSearchParams } from '../use-search-params'

export const useInvite = () => {
  const { userInfo, refetchUserInfo } = useUserStore()
  const { referralCode } = useTradeSearchParams()

  const { data: { data } = {} } = useQuery({
    enabled: !!referralCode,
    queryKey: [inviteApi.getDetail.name],
    queryFn: () => inviteApi.getDetail(referralCode),
  })

  const {
    isPending: isBinding,
    mutateAsync: bindInviter,
    reset: resetBind,
  } = useMutation({
    mutationKey: [inviteApi.bindInviter.name],
    mutationFn: async (overrideCode?: string | void) => {
      // Refresh user invite code. make sure it's the latest.
      await refetchUserInfo?.()

      console.log(
        'bind inviter',
        overrideCode,
        referralCode,
        userInfo?.code,
        userInfo?.inviter
      )

      const code = overrideCode ?? referralCode
      if (code === userInfo?.code || !!userInfo?.inviter.one) {
        return Promise.resolve()
      }

      return inviteApi.bindInviter({ invitationCode: code })
    },
  })

  return {
    inviterInfo: data,
    isBinding,
    bindInviter,
    resetBind,
  }
}
