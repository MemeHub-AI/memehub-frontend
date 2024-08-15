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

const withNonNull = (value: string) => value + t('memex.non-null')

export const createDetailSchema = z
  .object({
    name: z.string().min(1, { message: withNonNull(t('name')) }),
    symbol: z.string().min(1, { message: withNonNull(t('ticker')) }),
    logo: z.string().min(1, { message: withNonNull(t('logo')) }),
    desc: z.string().min(1, { message: withNonNull(t('description')) }),
    x: z.string().optional(),
    tg: z.string().optional(),
    website: z.string().optional(),
  })
  .merge(marketingSchema)

export const useCreateDetail = () => {
  const { query, ...router } = useRouter()
  const { postDetails, setPostDetails } = useMemexStore()
  const hash = query.hash as string | undefined

  const form = useForm<z.infer<typeof createDetailSchema>>({
    resolver: zodResolver(createDetailSchema),
    defaultValues: {
      name: '',
      symbol: '',
      logo: '',
      desc: '',
      x: '',
      tg: '',
      website: '',
      marketing: [],
    },
  })
  const { isUpdating, update } = useUpdateIdea(hash)

  const onSubmit = async (values: z.infer<typeof createDetailSchema>) => {
    if (!(await form.trigger())) return

    const params = {
      name: values.name,
      symbol: values.symbol,
      logo_url: values.logo,
      description: values.desc,
    } as MemexCreateReq

    if (values.x) params.twitter_url = values.x
    if (values.tg) params.telegram_url = values.tg
    if (values.website) params.website_url = values.website

    // is update details
    if (hash) {
      update({ hash, marketing: values.marketing, ...params })
      return
    }

    setPostDetails(params)
    router.back()
  }

  useEffect(() => {
    if (!postDetails) return

    const {
      name,
      symbol,
      logo_url,
      description,
      twitter_url,
      telegram_url,
      website_url,
      marketing,
    } = postDetails
    if (name) form.setValue('name', name)
    if (symbol) form.setValue('symbol', symbol)
    if (logo_url) form.setValue('logo', logo_url)
    if (description) form.setValue('desc', description)
    form.setValue('x', twitter_url)
    form.setValue('tg', telegram_url)
    form.setValue('website', website_url)
    form.setValue('marketing', marketing)
  }, [postDetails])

  return {
    form,
    onSubmit,
    isUpdating,
  }
}
