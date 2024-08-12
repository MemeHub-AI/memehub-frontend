import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { memexApi } from '@/api/memex'
import { reportException } from '@/errors'
import { useMemexStore } from '@/stores/use-memex'

export const createTweetMinChar = 10

const schema = z.object({
  content: z.string().min(createTweetMinChar),
  chain: z.string().min(1),
  pictures: z.array(z.string()).min(1).max(4),
})

export const useCreateTweet = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { tweet, tweetDetails, setTweetDetails, setTweet } = useMemexStore()
  const form = useForm<z.infer<typeof schema>>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      chain: '',
      pictures: [],
    },
  })

  const { isPending, mutateAsync, reset } = useMutation({
    mutationKey: [memexApi.createTweet.name],
    mutationFn: memexApi.createTweet,
    onMutate: () => toast.loading(t('memex.creating')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onSuccess: () => toast.success(t('memex.create-susccess')),
    onError: ({ message }) => {
      reset()
      reportException(message)
      toast.success(t('memex.create-failed'))
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!(await form.trigger())) return

    mutateAsync({
      ...values,
      image_urls: values.pictures,
      ...tweetDetails,
    }).then(() => {
      setTweet(null)
      setTweetDetails(null)
      router.back()
    })
  }

  useEffect(() => {
    if (!tweet) return

    form.setValue('content', tweet.content)
    form.setValue('chain', tweet.chain)
    form.setValue('pictures', tweet.image_urls)
    form.trigger()
  }, [tweet])

  return {
    form,
    onSubmit,
    isPending,
  }
}
