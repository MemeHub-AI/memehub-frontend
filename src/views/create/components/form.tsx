import React, { useRef, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { formatEther } from 'viem'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDeploy } from '../hooks/use-deploy'
import { Title } from './title'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useWalletStore } from '@/stores/use-wallet-store'
import {
  CreateTokenFormFields,
  type CreateTokenFormFieldsMethods,
} from './fields'
import { CreateTokenStatusDialog } from './dialog'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {}

export const CreateTokenForm = (props: Props) => {
  const { className } = props
  const { t } = useTranslation()
  const fieldsRef = useRef<CreateTokenFormFieldsMethods>(null)
  const { isConnected, chainId } = useAccount()

  const useDeployResult = useDeploy()
  const { deployFee, deploySymbol, isDeploying, deploy } = useDeployResult
  const { url, onChangeUpload } = useUploadImage()
  const { setConnectOpen } = useWalletStore()

  const fee = Number(formatEther(BigInt(deployFee))).toFixed(3)
  const symbol = deploySymbol

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.dismiss()

    if (!isConnected) return setConnectOpen(true)
    if (isDeploying) return
    if (!fieldsRef.current || !fieldsRef.current.validateFields()) return
    if (isEmpty(url)) {
      toast.error(t('create.upload-image'))
      return
    }
    if (typeof chainId !== 'number') return

    const { fieldsValues: f } = fieldsRef.current
    deploy({
      name: f.name,
      ticker: f.symbol,
      desc: f.description,
      image: url,
      chain_id: chainId.toString(),
      // Optional.
      twitter_url: f.twitter,
      telegram_url: f.telegram,
      website: f.website,
    })
  }

  return (
    <div className={cn('w-96', className)}>
      {/* All status dialog during create. */}
      <CreateTokenStatusDialog {...useDeployResult} />

      <Title className="w-fit max-sm:px-3 max-sm:mt-10">
        {t('create.new')}
      </Title>
      <form
        className={cn(
          'flex flex-col space-y-3 w-[460px] max-sm:w-full max-sm:px-3 max-sm:space-y-2'
        )}
        onSubmit={onSubmit}
      >
        {/* All input/textarea */}
        <CreateTokenFormFields
          ref={fieldsRef}
          disabled={isDeploying}
          onUpload={onChangeUpload}
        />

        {/* Submit button */}
        <div className="flex flex-col items-center space-y-2">
          <Button className="self-center px-10 mt-3" disabled={isDeploying}>
            {t('create')}
          </Button>
          <p className="self-center text-zinc-400 text-xs">
            {t('deploy.fee')}: {fee} {symbol}
          </p>
        </div>
      </form>
    </div>
  )
}
