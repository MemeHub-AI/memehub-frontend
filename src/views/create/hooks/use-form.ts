import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUploadImage } from '@/hooks/use-upload-image'

import { useDeploy } from './use-deploy'
import { useChainsStore } from '@/stores/use-chains-store'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { CoinType, Marketing } from '@/api/token/types'
import { URL_TYPE, utilsUrl } from '@/utils/url'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useConnectWallet } from '@/hooks/use-connect-wallet'
import { useStorage } from '@/hooks/use-storage'

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
  useDeployResult: ReturnType<typeof useDeploy>
) => {
  const { t } = useTranslation()
  const { formInfo } = useAimemeInfoStore()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { walletIsConnected } = useConnectWallet()
  const { evmChainsMap, loadingChains } = useChainsStore()
  const { url, onChangeUpload } = useUploadImage()
  const { deploy, isDeploying } = useDeployResult
  const { getMainChain } = useStorage()

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
    if (!(await form.trigger())) return

    // TODO: Modified after having new library
    // if (!checkForConnect()) return
    if (
      !(await checkForChain(evmChainsMap[values.chainName]?.id)) &&
      getMainChain() === 'evm'
    )
      return

    if (!walletIsConnected()) return

    if (isDeploying) return

    deploy({
      name: values.fullname! as string,
      ticker: values.symbol! as string,
      desc: values.description! as string,
      image: (values.logo! as string).replace('mini', 'origin'),
      chain: values.chainName as string,
      twitter_url: utilsUrl.mediaUrl(values.twitter, URL_TYPE.TWITTER),
      telegram_url: utilsUrl.mediaUrl(values.telegram, URL_TYPE.TELEGRAM),
      website: utilsUrl.mediaUrl(values.website, URL_TYPE.WEBSITE),
      coin_type: values.coinType as number,
      poster: values.poster,
      // Below only used for frontend.
      marketing: values.marketing as Marketing[],
    })
  }

  return {
    url,
    form,
    formFields,
    formSchema,
    loadingChains: loadingChains,
    onSubmit,
    onChangeUpload,
  }
}
