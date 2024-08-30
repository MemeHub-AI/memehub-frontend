import { memo, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { isEmpty } from 'lodash'

import { IdeaDataList } from '@/api/idea/type'
import { tokenApi } from '@/api/token'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { OnchainTokensChain, OnchainTokensRes } from '@/api/token/types'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { Img } from '@/components/img'
import { useCheckAccount } from '@/hooks/use-check-chain'

interface Props {
  ideaData: IdeaDataList | undefined
}

type ChainTuple = [string, OnchainTokensChain]

export const TokenInfo = ({ ideaData }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const type = router.query.type as string
  const [showChains, setShowChains] = useState<OnchainTokensRes>()
  const [showTokens, setShowTokens] = useState({
    chainName: '',
    chainData: {} as OnchainTokensChain,
  })
  const { onIdeaConfirm } = useGenAIIdea()
  const { setFormInfo, setLoadingLogo, setLoadingPoster } = useAimemeInfoStore()
  const { checkForConnect } = useCheckAccount()

  const onCreateNow = (item: IdeaDataList) => {
    if (!checkForConnect()) return

    router.push(Routes.Create)
    setFormInfo({
      name: item?.name,
      symbol: item?.symbol,
      description: item?.description,
    })
    setLoadingLogo(true)
    setLoadingPoster(true)
  }

  const { data } = useQuery({
    // enabled: !!ideaData?.name,
    enabled: false, // TODO/low: waiting for datahourse
    queryKey: ['searchForTokens'],
    queryFn: () => tokenApi.searchTokens(ideaData?.name ?? ''),
  })
  const chains = data?.data || {}

  const chainList = (chain: ChainTuple[], className?: string) => {
    return chain.map(([chainName, data], i) => {
      return (
        <div key={i} className={cn('flex justify-between', className)}>
          <div className="w-full flex justify-between items-center mt-2">
            <div className="flex items-center">
              <Avatar
                src={data.logo || ''}
                alt="Logo"
                className="w-[25px] h-[25px] object-cover rounded-full mr-2"
              />
              <div className="">
                {!isEmpty(data.token) ? (
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() =>
                      setShowTokens({ chainName, chainData: data })
                    }
                  >
                    {t('cream.puff').replace('$1', `${data.token.length}`)}
                  </span>
                ) : (
                  <span>{t('no.opponent')}</span>
                )}
              </div>
            </div>
            <span
              className="text-blue-600 text-sm cursor-pointer"
              onClick={() => {
                onIdeaConfirm({
                  name: ideaData?.name,
                  symbol: ideaData?.symbol,
                  description: ideaData?.description,
                  chainName,
                })
              }}
            >
              {data.token.length > 0 ? t('create.new.token') : t('take,lead')}
            </span>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex justify-between items-start px-2 max-sm:px-3 text-lg gap-2 leading-5 mb-2">
        <span className="font-bold break-all">{ideaData?.name}</span>
        {Object.keys(chains).length === 0 ? (
          <span
            className="ml-2 cursor-pointer text-nowrap text-base leading-5 text-blue-500 whitespace-nowrap"
            onClick={() => onCreateNow(ideaData!)}
          >
            {t('create.now')}
          </span>
        ) : null}
      </div>

      <div className="flex px-2">
        {type === '2' && (
          <Img
            src={ideaData?.logo}
            alt="img"
            className="w-20 h-20 rounded mr-2 shrink-0"
          />
        )}
        <Desc description={ideaData?.description ?? ''}></Desc>
      </div>
      <div className="px-2 max-sm:px-3">
        {chainList(Object.entries(chains).slice(0, 4))}
        {Object.entries(chains).length > 4 ? (
          <div
            className="text-gray-500 text-sm text-center cursor-pointer  mt-2"
            onClick={() => setShowChains(chains)}
          >
            {t('more...')}
          </div>
        ) : null}

        {/* All chain dialog */}
        <Dialog
          open={!!showChains}
          onOpenChange={() => setShowChains(undefined)}
          contentProps={{ className: 'max-w-[350px]' }}
        >
          <DialogTitle>{ideaData?.name}</DialogTitle>
          <Img
            src={ideaData?.logo}
            alt="logo"
            className="w-20 h-20 rounded object-cover"
          />
          <div>{chainList(Object.entries(chains), 'my-1')}</div>
        </Dialog>

        {/* All token dialog */}
        <Dialog
          open={!isEmpty(showTokens.chainName)}
          onOpenChange={() =>
            setShowTokens({
              chainName: '',
              chainData: {} as OnchainTokensChain,
            })
          }
        >
          <DialogTitle>{ideaData?.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Img
              src={showTokens.chainData.logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="mx-2 font-bold">
              {t('cream.puff').replace(
                '$1',
                `${showTokens.chainData.token?.length}`
              )}
            </span>
            {ideaData?.logo ? (
              <Img
                src={ideaData?.logo}
                alt="Logo"
                className="w-12 h-12 rounded-sm object-cover"
              />
            ) : null}
          </div>
          {showTokens.chainData.token?.map((token, i) => {
            return (
              <div key={i} className="mt-0">
                <div
                  className="text-blue-600 font-bold cursor-pointer hover:underline"
                  onClick={() => open(`${token.url}`)}
                >
                  {token.name}
                  {token.symbol ? `(${token.symbol})` : ''}
                </div>
                <div className="flex items-center gap-4">
                  <span>
                    24H {t('volume')}: ${fmt.decimals(token['24H_Volume'])}
                  </span>
                  {token.publish_at && (
                    <span>
                      {t('age')}: {token.publish_at}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </Dialog>
      </div>
    </>
  )
}

const Desc = memo(({ description }: { description: string }) => {
  const [show, setShow] = useState(false)
  const randomInt = Math.floor(Math.random() * 4) + 3

  return (
    <>
      <div
        className={cn(
          'max-sm:px-3 min-h-[50px] text-sm cursor-pointer',
          show ? '' : 'line-clamp-4'
        )}
        onClick={() => setShow(!show)}
      >
        {description}
        <span className="line-clamp-3 "></span>
        <span className="line-clamp-4 "></span>
        <span className="line-clamp-5 "></span>
        <span className="line-clamp-6 "></span>
        <span className="line-clamp-7 "></span>
      </div>
    </>
  )
})
