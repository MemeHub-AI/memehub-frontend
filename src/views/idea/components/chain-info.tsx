import { useMemo, useState } from 'react'
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
import { useChainsStore } from '@/stores/use-chains-store'

interface Props {
  ideaData: IdeaDataList | undefined
}

type ChainTuple = [string, OnchainTokensChain]

export const ChainInfo = ({ ideaData }: Props) => {
  const { t } = useTranslation()
  const [showChains, setShowChains] = useState<OnchainTokensRes>()
  const [showTokens, setShowTokens] = useState({
    chainName: '',
    chainData: {} as OnchainTokensChain,
  })
  const uniqueKey = useMemo(nanoid, [])
  const { onIdeaConfirm } = useGenAIIdea()

  const { data } = useQuery({
    enabled: !!ideaData?.symbol,
    queryKey: [uniqueKey],
    queryFn: () => tokenApi.onchainTokens(ideaData?.symbol ?? ''),
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
              className="text-blue-600 cursor-pointer"
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
    <div className="px-2  max-sm:px-3">
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
        <img
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
          setShowTokens({ chainName: '', chainData: {} as OnchainTokensChain })
        }
      >
        <DialogTitle>{ideaData?.name}</DialogTitle>
        <div className="flex items-center gap-2">
          <img
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
          <img
            src={ideaData?.logo}
            alt="Logo"
            className="w-12 h-12 rounded-sm object-cover"
          />
        </div>
        {showTokens.chainData.token?.map((token, i) => {
          return (
            <div key={i} className="mt-0">
              <div className="text-blue-600 font-bold">{token.symbol}</div>
              <div className="flex items-center gap-4">
                <span>
                  24H {t('volume')}: ${fmt.tradeFixed(token['24H_Volume'])}
                </span>
                {token.publish_at && (
                  <span>
                    {t('aget')}: {token.publish_at}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </Dialog>
    </div>
  )
}
