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
import { CONTRACT_ERR } from '@/errors/contract'
import { REQUEST_ERR } from '@/errors/request'
import { useEditIdeaAutofill } from './use-edit-idea-autofill'
import { useUpdateIdea } from './use-update-idea'

const schema = z.object({
  content: z.string().min(memexCreateIdeaCharMin),
  chain: z.string().min(1),
  pictures: z.array(z.string()).min(1).max(4),
})

export const useCreateIdea = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { idea, ideaDetails, setIdea, setIdeaDetails } = useMemexStore()
  const hash = query.hash as string

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
      REQUEST_ERR.message(message)
      toast.success(t('memex.create-failed'))
    },
  })
  const { isUpdating, update } = useUpdateIdea(hash, {
    showSuccessTips: true,
    onSuccess: router.back,
  })

  const { memexFactoryAddr, airdropAddress, bcAddress } = useTokenConfig()
  const { deployFee, isDeploying, deploy } = useDeployIdea(() => {
    setIdea(null)
    setIdeaDetails(null)
    router.back()
  })

  const onSubmit = async ({ pictures, ...values }: z.infer<typeof schema>) => {
    if (
      !(await form.trigger()) ||
      !memexFactoryAddr ||
      !airdropAddress ||
      !bcAddress
    ) {
      CONTRACT_ERR.configNotFound()
      return
    }

    if (hash) {
      update({
        hash,
        image_urls: pictures,
        ...ideaDetails,
        ...values,
      })
      return
    }

    try {
      const { data } = await mutateAsync({
        factory_address: memexFactoryAddr,
        airdrop_address: airdropAddress,
        coin_factory_address: bcAddress,
        image_urls: pictures,
        airdrop_marketing: ideaDetails?.airdrop_marketing || [],
        ...ideaDetails,
        ...values,
      })

      await deploy(
        data.hash,
        data.coin_id,
        ideaDetails?.name,
        ideaDetails?.symbol,
        ideaDetails?.airdrop_marketing
      )
    } catch (e) {
      reportException(e)
    }
  }

  useEditIdeaAutofill()

  useEffect(() => {
    if (!idea) return

    form.setValue('content', idea.content)
    form.setValue('chain', idea.chain)
    form.setValue('pictures', idea.image_urls)
    form.trigger()
  }, [idea])

  return {
    form,
    onSubmit,
    isCreating: isPending || isDeploying || isUpdating,
    deployFee,
  }
}
