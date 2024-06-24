import { useMutation } from '@tanstack/react-query'

import { inviteApi } from '@/api/invite'
import { useUserStore } from '@/stores/use-user-store'
import { useTradeSearchParams } from '../use-search-params'

export const useInvite = () => {
  const { userInfo, refetchUserInfo } = useUserStore()
  const { referralCode } = useTradeSearchParams()

  const {
    isPending: isBinding,
    mutateAsync: bindInviter,
    reset: resetBind,
  } = useMutation({
    mutationKey: [inviteApi.bindInviter.name],
    mutationFn: async (overrideCode?: string | void) => {
      const code = overrideCode ?? referralCode
      console.log('bind', code, userInfo?.code)
      if (code === userInfo?.code || userInfo?.inviter) {
        return Promise.resolve()
      }

      const { data } = await inviteApi.bindInviter({ invitationCode: code })
      await refetchUserInfo?.()
      return data
    },
  })

  return {
    isBinding,
    bindInviter,
    resetBind,
  }
}
