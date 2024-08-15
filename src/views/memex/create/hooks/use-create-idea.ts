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
import { memexCreateIdeaCharMin } from '@/config/memex/idea'
import { useDeployIdea } from './use-deploy-idea'
import { useTokenConfig } from '@/hooks/use-token-config'

const schema = z.object({
  content: z.string().min(memexCreateIdeaCharMin),
  chain: z.string().min(1),
  pictures: z.array(z.string()).min(1).max(4),
})

export const useCreateIdea = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    idea: post,
    ideaDetails: postDetails,
    setIdeaDetails: setPostDetails,
    setIdea: setPost,
  } = useMemexStore()

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
    mutationKey: [memexApi.createIdea.name],
    mutationFn: memexApi.createIdea,
    onMutate: () => toast.loading(t('memex.creating')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: ({ message }) => {
      reset()
      reportException(message)
      toast.success(t('memex.create-failed'))
    },
  })

  const { memexFactoryAddr, airdropAddress } = useTokenConfig()
  const { deployFee, isDeploying, deploy } = useDeployIdea(() => {
    setPost(null)
    setPostDetails(null)
    router.back()
  })

  const onSubmit = async ({ pictures, ...values }: z.infer<typeof schema>) => {
    if (!(await form.trigger()) || !memexFactoryAddr || !airdropAddress) return

    try {
      const { data } = await mutateAsync({
        image_urls: pictures,
        factory_address: memexFactoryAddr,
        airdrop_address: airdropAddress!,

        ...values,
        ...postDetails,
      })

      await deploy(
        data.hash,
        data.coin_id,
        postDetails?.name,
        postDetails?.symbol,
        postDetails?.marketing
      )
    } catch (e) {
      reportException(e)
    }
  }

  useEffect(() => {
    if (!post) return

    form.setValue('content', post.content)
    form.setValue('chain', post.chain)
    form.setValue('pictures', post.image_urls)
    form.trigger()
  }, [post])

  return {
    form,
    onSubmit,
    isCreating: isPending || isDeploying,
    deployFee,
  }
}
