import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { UserInfoRes } from '@/api/user/types'

import { userApi } from '@/api/user'
import { useStorage } from './use-storage'
import { useUserStore } from '@/stores/use-user-store'

interface Options {
  onUpdateSuccess?: (data: UserInfoRes) => void
  onFollowSuccess?: (data: UserInfoRes) => void
}

export const useUser = (options?: Options) => {
  const { onUpdateSuccess, onFollowSuccess } = options || {}
  const { t } = useTranslation()
  const { setUserInfo } = useUserStore()
  const { setToken } = useStorage()

  // Login/register a user.
  const { isPending: isLoggingIn, mutateAsync: login } = useMutation({
    mutationKey: [userApi.login.name],
    mutationFn: userApi.login,
    onMutate: () => toast.loading(t('user.login.loading')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: () => toast.error(t('user.login.failed')),
    onSuccess({ data }) {
      if (!data) return
      setToken(data.token)
      setUserInfo(data.user)
      toast.success(t('user.login.success'))
    },
  })

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
    onSettled: (_, __, ___, id) => toast.dismiss(id),
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
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: () => toast.error(t('user.unfollow.failed')),
    onSuccess: ({ data }) => {
      if (!data) return
      setUserInfo(data)
      onFollowSuccess?.(data)
      toast.success(t('user.unfollow.success'))
    },
  })

  return {
    isLoggingIn,
    isUpdating,
    isFollowing,
    isUnfollowing,
    login,
    update,
    follow,
    unfollow,
  }
}
