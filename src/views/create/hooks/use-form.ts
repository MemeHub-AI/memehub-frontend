import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useUploadImage } from '@/hooks/use-upload-image'
import { toast } from 'sonner'

import { useDeploy } from './use-deploy'
import { useChainsStore } from '@/stores/use-chains-store'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { CoinType, Marketing } from '@/api/token/types'
import { ContractVersion } from '@/enum/contract'

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

const enum URL_TYPE {
  TWITTER = 'https://x.com/',
  TELEGRAM = 'https://t.me/',
  WEBSITE = 'https://',
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

  const isWebsite = (v?: string) => {
    if (!v) return true

    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )
    return !!pattern.test(v)
  }

  const handleUrl = (value: string = '', type: URL_TYPE) => {
    if (value) {
      if (value.startsWith('@')) {
        value = value.replace('@', '')
      }
      return /^(https|http):\/\//.test(value) ? value : `${type}${value}`
    }
    return value
  }

  const formSchema = z.object({
    [formFields.fullname]: z.string().refine(validateInput, require),
    [formFields.symbol]: z.string().refine(validateInput, require),
    [formFields.description]: z.string().refine(validateInput, require),
    [formFields.twitter]: z.string().optional(),
    [formFields.telegram]: z.string().optional(),
    [formFields.website]: z
      .string()
      .optional()
      .refine(isWebsite, {
        message: t('url.error'),
      }),
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

    deploy({
      name: values.fullname! as string,
      ticker: values.symbol! as string,
      desc: values.description! as string,
      image: (values.logo! as string).replace('mini', 'origin'),
      chain: values.chainName as string,
      twitter_url: handleUrl(values.twitter, URL_TYPE.TWITTER),
      telegram_url: handleUrl(values.telegram, URL_TYPE.TELEGRAM),
      website: handleUrl(values.website, URL_TYPE.WEBSITE),
      coin_type: values.coinType as number,
      marketing: values.marketing as Marketing[],
      version: ContractVersion.V3, // Mark version for create token.
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
