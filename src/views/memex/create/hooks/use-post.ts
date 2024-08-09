import { memexApi } from '@/api/memex'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// interface Options {
//   onPostSuccess: () => void
// }

export const usePost = () => {
  const { t } = useTranslation()
  const {
    mutateAsync: postTweet,
    isPending,
    isError,
  } = useMutation({
    mutationFn: memexApi.postTweet,
    onSuccess: () => {
      toast.success(t('approve.success'))
      // onPostSuccess?.()
    },
    onMutate: () => {
      toast.loading(t('loading'))
    },
  })
  return {
    postTweet,
    isPending,
    isError,
  }
}
