import { useDeploy } from './use-deploy'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useQuery } from '@tanstack/react-query'
import { chainApi } from '@/api/chain'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { aiApi } from '@/api/ai'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

const formFields = {
  fullname: 'fullname',
  symbol: 'symbol',
  description: 'description',
  twitter: 'twitter',
  telegram: 'telegram',
  website: 'website',
  chainId: 'chainId',
  logo: 'logo',
}

export const useCreateTokenForm = (
  useDeployResult: ReturnType<typeof useDeploy>
) => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { query } = useRouter()

  const { getAIMemeInfo, isLoadingMemeImg, isLoadingMemeInfo } = useAIMemeInfo()

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
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger()

    if (!isValid) return
    if (!isConnected) return setConnectOpen(true)
    if (isDeploying) return
    if (typeof values.chainId !== 'number') return

    deploy({
      name: values.name!,
      ticker: values.symbol!,
      desc: values.description!,
      image: url,
      chain_id: `${values.chainId}`,
      // Optional.
      twitter_url: values.twitter,
      telegram_url: values.telegram,
      website: values.website,
    })
  }

  useEffect(() => {
    if (!query) return
    getAIMemeInfo(
      (query.title || '') as string,
      (query.description || '') as string,
      (data) => {
        form.setValue(formFields.fullname, data?.name!)
        form.setValue(formFields.description, data?.description)
      },
      (data) => {
        form.setValue(formFields.logo, data?.[0])
      }
    )
  }, [])

  return {
    form,
    formFields,
    chains,
    loadingChains: loadingChains,
    isLoadingMemeInfo,
    isLoadingMemeImg,
    onSubmit,
  }
}
