import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { t } from 'i18next'

import { useMemexStore } from '@/stores/use-memex'
import { marketingSchema } from '@/components/marketing-field'
import { MemexCreateReq } from '@/api/memex/types'
import { useUpdateIdea } from '../../hooks/use-update-idea'
import { useEditIdeaAutofill } from '../../hooks/use-edit-idea-autofill'

const withNonNull = (value: string) => value + t('memex.non-null')

export const createDetailSchema = z
  .object({
    name: z.string().min(1, { message: withNonNull(t('name')) }),
    symbol: z.string().min(1, { message: withNonNull(t('ticker')) }),
    logo: z.string().min(1, { message: withNonNull(t('logo')) }),
    desc: z.string().min(1, { message: withNonNull(t('description')) }),
    x: z.string().optional().nullable(),
    tg: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
  })
  .merge(marketingSchema)

export const useCreateIdeaDetails = () => {
  const { query, ...router } = useRouter()
  const { ideaDetails, setIdeaDetails } = useMemexStore()
  const hash = query.hash as string | undefined

  const form = useForm<z.infer<typeof createDetailSchema>>({
    resolver: zodResolver(createDetailSchema),
    defaultValues: {
      name: '',
      symbol: '',
      logo: '',
      desc: '',
      marketing: [],
      x: '',
      tg: '',
      website: '',
    },
  })
  const { isUpdating, updateWithContract } = useUpdateIdea(hash, {
    onContractSuccess: router.back,
  })

  const onSubmit = async (values: z.infer<typeof createDetailSchema>) => {
    if (!(await form.trigger())) return

    const params = {
      name: values.name,
      symbol: values.symbol,
      logo_url: values.logo,
      description: values.desc,
      airdrop_marketing: values.marketing,
    } as MemexCreateReq

    if (values.x) params.twitter_url = values.x
    if (values.tg) params.telegram_url = values.tg
    if (values.website) params.website_url = values.website

    // is update details
    if (hash) {
      updateWithContract({ hash, ...params })
      return
    }

    setIdeaDetails(params)
    router.back()
  }

  useEditIdeaAutofill()

  useEffect(() => {
    if (!ideaDetails) return

    form.setValue('name', ideaDetails?.name || '')
    form.setValue('symbol', ideaDetails?.symbol || '')
    form.setValue('logo', ideaDetails?.logo_url || '')
    form.setValue('desc', ideaDetails?.description || '')
    form.setValue('marketing', ideaDetails?.airdrop_marketing || [])
    form.setValue('x', ideaDetails?.twitter_url)
    form.setValue('tg', ideaDetails?.telegram_url)
    form.setValue('website', ideaDetails?.website_url)
  }, [ideaDetails])

  return {
    form,
    onSubmit,
    isUpdating,
  }
}