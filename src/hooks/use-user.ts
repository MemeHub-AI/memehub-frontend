import { useMutation } from '@tanstack/react-query'

import type { NewUserReq } from '@/api/user/types'

import { fmt } from '@/utils/fmt'
import { userApi } from '@/api/user'
import { useStorage } from './use-storage'
import { useUserStore } from '@/stores/use-user-store'

export const useUser = () => {
  const {} = useUserStore()
  const { setToken } = useStorage()
  const { isPending, mutateAsync } = useMutation({
    mutationKey: [userApi.new.name],
    mutationFn: userApi.new,
  })

  const login = async (
    params: Pick<NewUserReq, 'wallet_address' | 'chain_id' | 'sign'>
  ) => {
    const { data } = await mutateAsync({
      name: fmt.addr(params.wallet_address),
      logo: 'https://storage.memehub.ai/avater.png',
      description: 'A Meme boy/girl',
      ...params,
    })

    setToken(data.token)
  }

  return {
    isPending,
    login,
  }
}
