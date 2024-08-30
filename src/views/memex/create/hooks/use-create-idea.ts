import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'

import { memexApi } from '@/api/memex'
import { reportException } from '@/errors'
import { useMemexStore } from '@/stores/use-memex'
import { memexCreateConfig } from '@/config/memex/idea'
import { DeployIdeaParams, useDeployIdea } from './use-deploy-idea'
import { useTokenConfig } from '@/hooks/use-token-config'
import { CONTRACT_ERR } from '@/errors/contract'
import { REQUEST_ERR } from '@/errors/request'
import { useEditIdeaAutofill } from './use-edit-idea-autofill'
import { useUpdateIdea } from './use-update-idea'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { ApiCode } from '@/api/types'
import { useChainInfo } from '@/hooks/use-chain-info'
import { Routes } from '@/routes'

const schema = z.object({
  content: z
    .string()
    .min(memexCreateConfig.minChar)
    .max(memexCreateConfig.maxChar),
  chain: z.string().min(1),
  pictures: z.array(z.string()).min(1).max(memexCreateConfig.maxImage),
})

const lastCreateParams: Pick<DeployIdeaParams, 'projectId' | 'tokenId'> = {
  projectId: '',
  tokenId: '',
}

// TODO/low: refactor
export const useCreateIdea = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { idea, ideaDetails, setIdea, setIdeaDetails } = useMemexStore()
  const hash = query.hash as string

  const form = useForm<z.infer<typeof schema>>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      chain: '',
      pictures: [],
    },
  })
  const chainName = idea?.chain || form.getValues('chain')

  const { chainId, getChainId } = useChainInfo(chainName)
  const { address } = useAccount()
  const { data: balabce = '0' } = useBalance({
    address,
    chainId,
    query: { select: ({ value }) => formatEther(value) },
  })

  const { isPending, mutateAsync, reset } = useMutation({
    mutationKey: [memexApi.createIdea.name],
    mutationFn: memexApi.createIdea,
    onMutate: () => toast.loading(t('memex.creating')),
    onSettled: (_, __, ___, id) => toast.dismiss(id),
    onError: ({ message, status }: Response & Error) => {
      if (status === ApiCode.Conflict) return
      reset()
      REQUEST_ERR.message(message)
      toast.error(t('memex.create-failed'))
    },
  })
  const { isUpdating, update } = useUpdateIdea(hash, {
    showSuccessTips: true,
    onSuccess: router.back,
  })

  const { memexFactoryAddr, airdropAddress, bcAddress } =
    useTokenConfig(chainName)

  const { deployFee, isDeploying, deploy } = useDeployIdea(chainName, () => {
    setIdea(null)
    setIdeaDetails(null)
    router.push(Routes.MemexLatest)
  })
  const { checkAccount } = useCheckAccount()

  const totalDeployFee = useMemo(
    () =>
      BigNumber(deployFee)
        .plus(ideaDetails?.initialBuyAmount || 0)
        .toFixed(),
    [deployFee, ideaDetails]
  )

  const onSubmit = async ({ pictures, ...values }: z.infer<typeof schema>) => {
    if (!(await checkAccount(getChainId(values.chain)))) return
    if (
      !(await form.trigger()) ||
      !memexFactoryAddr ||
      !airdropAddress ||
      !bcAddress
    ) {
      CONTRACT_ERR.configNotFound(
        `${chainName} ${memexFactoryAddr} ${airdropAddress} ${bcAddress}`
      )
      return
    }
    if (BigNumber(balabce).lt(totalDeployFee)) {
      CONTRACT_ERR.balanceInsufficient()
      return
    }

    if (hash) {
      update({
        hash,
        image_urls: pictures,
        ...ideaDetails,
        ...values,
      })
      return
    }

    const deployParams = {
      name: ideaDetails?.name,
      symbol: ideaDetails?.symbol,
      marketing: ideaDetails?.airdrop_marketing,
      initialBuyAmount: ideaDetails?.initialBuyAmount || '0',
    }

    try {
      const { data } = await mutateAsync({
        factory_address: memexFactoryAddr,
        airdrop_address: airdropAddress,
        coin_factory_address: bcAddress,
        image_urls: pictures,
        airdrop_marketing: ideaDetails?.airdrop_marketing || [],
        ...ideaDetails,
        ...values,
      })

      lastCreateParams.projectId = data.hash
      lastCreateParams.tokenId = data.coin_id
      await deploy({ ...lastCreateParams, ...deployParams })
    } catch (e) {
      if ((e as Response).status === ApiCode.Conflict) {
        return deploy({ ...lastCreateParams, ...deployParams }).catch(() => {})
      }
      reportException(e)
    }
  }

  useEditIdeaAutofill()

  useEffect(() => {
    if (!idea) return

    form.setValue('content', idea.content)
    form.setValue('chain', idea.chain)
    form.setValue('pictures', idea.image_urls)
    form.trigger()
  }, [idea])

  return {
    form,
    onSubmit,
    isCreating: isPending || isDeploying || isUpdating,
    deployFee: totalDeployFee,
  }
}
