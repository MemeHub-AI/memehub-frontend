import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { isEmpty } from 'lodash'

import { utilLang } from '@/utils/lang'
import { useMutation } from '@tanstack/react-query'
import { memexApi } from '@/api/memex'
import { reportException } from '@/errors'
import { memexIdeaConfig } from '@/config/memex/idea'

const { commentMaxImg, commentMaxChar } = memexIdeaConfig

const schema = z.object({
  comment: z
    .string()
    .min(1, { message: t('comment.empty') })
    .max(commentMaxChar),
  images: z.array(z.string()).max(commentMaxImg, {
    message: utilLang.replace(t('iamges.max'), [commentMaxImg]),
  }),
})

export const useCommentForm = (hash: string, onSuccess?: () => void) => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof schema>>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      comment: '',
      images: [],
    },
  })

  const { isPending, mutateAsync, reset } = useMutation({
    mutationKey: [memexApi.addIdeaComment.name],
    mutationFn: memexApi.addIdeaComment,
    onMutate: () => toast.loading(t('comment.loading')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: ({ message }) => {
      reportException(message)
      reset()
    },
    onSuccess: () => {
      onSuccess?.()
      form.reset()
      toast.success(t('comment.success'))
    },
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (isEmpty(hash)) return
    mutateAsync({
      hash,
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
