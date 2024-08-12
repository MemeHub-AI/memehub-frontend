import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const useCreateForm = () => {
  const { t } = useTranslation()
  const require = {
    message: t('fields.required'),
  }

  const detailFormSchema = z
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

  const detailForm = useForm<z.infer<typeof detailFormSchema>>({
    resolver: zodResolver(detailFormSchema),
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

  const validateInput = (v: string) => v.trim().length !== 0
  const isEnpty = (arr: string[] | []) => arr.length
  const mainFormSchema = z.object({
    idea: z.string().refine(validateInput, require),
    chainName: z.string().refine(validateInput, require),
    images: z.array(z.string()).refine(isEnpty, require),
  })

  const mainForm = useForm<z.infer<typeof mainFormSchema>>({
    resolver: zodResolver(mainFormSchema),
    defaultValues: {
      idea: '',
      chainName: '',
      images: [],
    },
  })

  const handleConfirm = () => {
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
  }
  return {
    mainForm,
    detailForm,
    handleConfirm,
  }
}
