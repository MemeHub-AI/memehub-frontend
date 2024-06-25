import { useMutation, useQuery } from '@tanstack/react-query'

import { inviteApi } from '@/api/invite'
import { useTradeSearchParams } from '../use-search-params'
import { useUserInfo } from '@/hooks/use-user-info'

export const useInvite = () => {
  const { userInfo, refetchUserInfo } = useUserInfo()
  const { referralCode } = useTradeSearchParams()

  const { data: { data } = {} } = useQuery({
    enabled: !!referralCode,
    queryKey: [inviteApi.getDetail.name, referralCode],
    queryFn: () => inviteApi.getDetail(referralCode),
  })

  const {
    isPending: isBinding,
    mutateAsync: bindInviter,
    reset: resetBind,
  } = useMutation({
    mutationKey: [inviteApi.bindInviter.name],
    mutationFn: async (overrideCode?: string | void) => {
      await refetchUserInfo()

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
