import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const useCreateMainForm = () => {
  const { t } = useTranslation()
  const require = {
    message: t('fields.required'),
  }

  const validateInput = (v: string) => v.trim().length !== 0

  const formSchema = z.object({
    idea: z.string().refine(validateInput),
    chainName: z.string().optional(),
    images: z.array(z.string()).optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idea: '',
      chainName: '',
      images: [],
    },
  })
  // const onSubmit = async () => {
  //   console.log('test')

  //   // const isValid = await form.trigger()

  //   // if (!isValid) return
  //   // if (!isConnected) return setConnectOpen(true)
  // }

  return form
}
