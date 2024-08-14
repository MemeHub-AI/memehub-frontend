import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { utilLang } from '@/utils/lang'
import { useMutation } from '@tanstack/react-query'
import { memexApi } from '@/api/memex'
import { reportException } from '@/errors'
import { usePostDetailsContext } from '@/contexts/memex/post-details'

export const memexCommentImageMax = 2

const schema = z.object({
  comment: z.string().min(1, { message: t('comment.empty') }),
  images: z.array(z.string()).max(memexCommentImageMax, {
    message: utilLang.replace(t('iamges.max'), [memexCommentImageMax]),
  }),
})

export const useCommentForm = () => {
  const { t } = useTranslation()
  const { refetchComments } = usePostDetailsContext()
  const { query } = useRouter()
  const id = query.id as string

  const form = useForm<z.infer<typeof schema>>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      comment: '',
      images: [],
    },
  })

  const { isPending, mutateAsync, reset } = useMutation({
    mutationKey: [memexApi.addPostComment.name],
    mutationFn: memexApi.addPostComment,
    onMutate: () => toast.loading(t('comment.loading')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: ({ message }) => {
      reportException(message)
      reset()
    },
    onSuccess: () => {
      refetchComments()
      form.reset()
      toast.success(t('comment.success'))
    },
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    mutateAsync({
      hash: id,
      content: values.comment,
      image_urls: values.images,
    })
  }

  return {
    form,
    isPending,
    onSubmit,
  }
}
