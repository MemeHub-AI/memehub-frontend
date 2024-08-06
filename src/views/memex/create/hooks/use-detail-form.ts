import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const useCreateDetailForm = () => {
  const { t } = useTranslation()
  // const tickerValidate = (v: string) =>

  const formSchema = z
    .object({
      ticker: z.string().optional(),
      name: z.string().optional(),
      logo: z.string().optional(),
      description: z.string().optional(),
      twitter: z.string().optional(),
      telegram: z.string().optional(),
      website: z.string().optional(),
    })
    .refine(
      (data) => {
        const bothEmpty = !data.ticker && !data.name
        const bothFilled = !!data.ticker && !!data.name
        return bothEmpty || bothFilled
      },
      {
        message: t('require'),
        path: ['name', 'trick'], // Optional: Set the path to show the error on both fields
      }
    )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: '',
      name: '',
      logo: '',
      description: '',
      twitter: '',
      telegram: '',
      website: '',
    },
  })

  return form
}
