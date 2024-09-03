import { toast } from 'sonner'

import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { UserInfoRes } from '@/api/user/types'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/use-user-store'

interface Options {
  onUpdateSuccess?: (data: UserInfoRes) => void
  onFollowSuccess?: (data: UserInfoRes) => void
  onFollowFinlly?: () => void
}

export const useUser = (options?: Options) => {
  const { onUpdateSuccess, onFollowSuccess, onFollowFinlly } = options || {}
  const { t } = useTranslation()
  const { setUserInfo } = useUserStore()

  // Update user info.
  const { isPending: isUpdating, mutateAsync: update } = useMutation({
    mutationKey: [userApi.updateInfo.name],
    mutationFn: userApi.updateInfo,
    onMutate: () => toast.loading(t('user.update.loading')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: () => toast.error(t('user.update.failed')),
    onSuccess: ({ data }) => {
      if (!data) return
      setUserInfo(data)
      onUpdateSuccess?.(data)
      toast.success(t('user.update.success'))
    },
  })

  // Follow a user.
  const { isPending: isFollowing, mutateAsync: follow } = useMutation({
    mutationKey: [userApi.follow.name],
    mutationFn: userApi.follow,
    onMutate: () => toast.loading(t('user.follow.loading')),
    onSettled: (_, __, ___, id) => {
      onFollowFinlly?.()
      return toast.dismiss(id)
    },
    onError: () => toast.error(t('user.follow.failed')),
    onSuccess: ({ data }) => {
      if (!data) return
      setUserInfo(data)
      onFollowSuccess?.(data)
      toast.success(t('user.follow.success'))
    },
  })

  // Unfollow a user.
  const { isPending: isUnfollowing, mutateAsync: unfollow } = useMutation({
    mutationKey: [userApi.unfollow.name],
    mutationFn: userApi.unfollow,
    onMutate: () => toast.loading(t('user.unfollow.loading')),
    onSettled: (_, __, ___, id) => {
      onFollowFinlly?.()
      return toast.dismiss(id)
    },
    onError: () => toast.error(t('user.unfollow.failed')),
    onSuccess: ({ data }) => {
      if (!data) return
      setUserInfo(data)
      onFollowSuccess?.(data)
      toast.success(t('user.unfollow.success'))
    },
  })

  return {
    isUpdating,
    isFollowing,
    isUnfollowing,
    update,
    follow,
    unfollow,
  }
}
