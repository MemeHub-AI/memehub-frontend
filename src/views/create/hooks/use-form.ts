import { useDeploy } from './use-deploy'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUploadImage } from '@/hooks/use-upload-image'
import { toast } from 'sonner'

import { useChainsStore } from '@/stores/use-chains-store'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'

export const formFields = {
  fullname: 'fullname',
  symbol: 'symbol',
  description: 'description',
  twitter: 'twitter',
  telegram: 'telegram',
  website: 'website',
  chainName: 'chainName',
  logo: 'logo',
  poster: 'poster',
}

export const useCreateTokenForm = (
  useDeployResult: ReturnType<typeof useDeploy>
) => {
  const { t } = useTranslation()
  const { isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()

  const { formInfo } = useAimemeInfoStore()
  const { setConnectOpen } = useWalletStore()
  const { chains, loadingChains } = useChainsStore()
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
    [formFields.chainName]: z.string().refine(validateInput, require),
    [formFields.logo]: z.string().refine(validateInput, require),
    [formFields.poster]: z.array(z.string()).optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [formFields.fullname]: formInfo?.name || '',
      [formFields.symbol]: formInfo?.symbol || '',
      [formFields.description]: formInfo?.description || '',
      [formFields.twitter]: '',
      [formFields.telegram]: '',
      [formFields.website]: '',
      [formFields.chainName]: '',
      [formFields.logo]: '',
      [formFields.poster]: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger()

    if (!isValid) return
    if (!isConnected) return setConnectOpen(true)
    if (isDeploying) return
    const vChainId = Number(chains.find((c) => c.name === values.chainName)?.id)
    if (vChainId !== chainId) {
      toast.error(t('swatch.chain').replace('$1', values.chainName! as string))
      switchChain({ chainId: vChainId })
      return
    }

    deploy({
      name: values.fullname! as string,
      ticker: values.symbol! as string,
      desc: values.description! as string,
      image: (values.logo! as string).replace('mini', 'origin'),
      chain: values.chainName as string,
      // Optional.
      twitter_url: values.twitter as string,
      telegram_url: values.telegram as string,
      website: values.website as string,
    })
  }

  return {
    url,
    form,
    formFields,
    formSchema,
    chains,
    loadingChains: loadingChains,
    onSubmit,
    onChangeUpload,
  }
}
