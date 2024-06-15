import { useDeployV1 } from './use-deploy-v1'
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
import { CoinType, Marketing } from '@/api/token/types'

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
  coinType: 'coinType',
  marketing: 'marketing',
} as const

export const useCreateTokenForm = (
  useDeployResult: ReturnType<typeof useDeployV1>
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
    [formFields.coinType]: z.number(),
    [formFields.marketing]: z
      .array(z.object({ type: z.number(), percent: z.number() }))
      .optional(),
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
      [formFields.coinType]: CoinType.Normal,
      [formFields.marketing]: [],
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

    console.log('submit deploy', values)
    deploy({
      name: values.fullname! as string,
      ticker: values.symbol! as string,
      desc: values.description! as string,
      image: (values.logo! as string).replace('mini', 'origin'),
      chain: values.chainName as string,
      twitter_url: values.twitter as string,
      telegram_url: values.telegram as string,
      website: values.website as string,
      coin_type: values.coinType as number,
      marketing: values.marketing as Marketing[],
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
