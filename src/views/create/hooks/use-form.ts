import { useDeploy } from './use-deploy'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

export const formFields = {
  fullname: 'fullname',
  symbol: 'symbol',
  description: 'description',
  twitter: 'twitter',
  telegram: 'telegram',
  website: 'website',
  chainId: 'chainId',
  logo: 'logo',
  poster: 'poster',
}

export const useCreateTokenForm = (
  useDeployResult: ReturnType<typeof useDeploy>
) => {
  const { t } = useTranslation()
  const { isConnected, chainId } = useAccount()
  const { query } = useRouter()
  const { switchChainAsync } = useSwitchChain()

  const { setConnectOpen, chains, loadingChains } = useWalletStore()
  const { url, onChangeUpload } = useUploadImage()
  const { deploy, isDeploying } = useDeployResult

  const require = {
    message: t('fields.required'),
  }

  const validateInput = (v: string) => v.trim().length !== 0

  const formSchema = z.object({
    [formFields.fullname]: z.string().refine(validateInput, require),
    [formFields.symbol]: z.string().refine(validateInput, require),
    [formFields.description]: z.string().refine(validateInput, require),
    [formFields.twitter]: z.string().optional(),
    [formFields.telegram]: z.string().optional(),
    [formFields.website]: z.string().optional(),
    [formFields.chainId]: z.string().refine(validateInput, require),
    [formFields.logo]: z.string().refine(validateInput, require),
    [formFields.poster]: z.array(z.string()).optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [formFields.fullname]: '',
      [formFields.symbol]: '',
      [formFields.description]: '',
      [formFields.twitter]: '',
      [formFields.telegram]: '',
      [formFields.website]: '',
      [formFields.chainId]: '1',
      [formFields.logo]: '',
      [formFields.poster]: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger()

    if (!isValid) return
    if (!isConnected) return setConnectOpen(true)
    if (isDeploying) return
    if (typeof values.chainId !== `${chainId}`) {
      switchChainAsync({ chainId: Number(values.chainId) })
    }

    deploy({
      name: values.fullname! as string,
      ticker: values.symbol! as string,
      desc: values.description! as string,
      image: url,
      chain_id: `${values.chainId}`,
      // Optional.
      twitter_url: values.twitter as string,
      telegram_url: values.telegram as string,
      website: values.website as string,
    })
  }

  return {
    form,
    formFields,
    formSchema,
    chains,
    loadingChains: loadingChains,
    onSubmit,
  }
}
