import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { t } from 'i18next'

import { useMemexStore } from '@/stores/use-memex'
import { marketingSchema } from '@/components/marketing-field'

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
  const router = useRouter()
  const { postDetails: tweetDetails, setPostDetails: setTweetDetails } =
    useMemexStore()

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

  const onSubmit = async (values: z.infer<typeof createDetailSchema>) => {
    if (!(await form.trigger())) return

    setTweetDetails({
      ...values,
      logo_url: values.logo,
      description: values.desc,
      twitter_url: values.x,
      telegram_url: values.tg,
      website_url: values.website,
    })
    router.back()
  }

  useEffect(() => {
    if (!tweetDetails) return

    const {
      name,
      symbol,
      logo_url,
      description,
      twitter_url,
      telegram_url,
      website_url,
      marketing,
    } = tweetDetails
    if (name) form.setValue('name', name)
    if (symbol) form.setValue('symbol', symbol)
    if (logo_url) form.setValue('logo', logo_url)
    if (description) form.setValue('desc', description)
    form.setValue('x', twitter_url)
    form.setValue('tg', telegram_url)
    form.setValue('website', website_url)
    form.setValue('marketing', marketing)
  }, [tweetDetails])

  return {
    form,
    onSubmit,
  }
}
