import { IdeaData } from '@/api/idea/type'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  data: IdeaData
}

interface Puff {
  logo?: string
  name: string
  liquidity24h: string
  volume: string
  aget: string
}

interface Chain {
  chain: {
    logo: string
    name: string
  }
  logo: string
  puffList: Puff[]
}

export const ChainInfo = ({ data }: Props) => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const [showPuff, setShowPuff] = useState(false)
  const [chainInfo, setChainInfo] = useState<Chain>({
    chain: {
      logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
      name: 'Solana',
    },
    logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
    puffList: [
      {
        name: 'Maga(Trump)',
        liquidity24h: '$3.5M',
        volume: '$9.3M',
        aget: '2mo 27d',
      },
      {
        name: 'Maga(Trump)',
        liquidity24h: '$3.5M',
        volume: '$9.3M',
        aget: '2mo 27d',
      },
    ],
  })

  const chains = new Array<Chain>(Math.floor(Math.random() * 5) + 1).fill({
    chain: {
      logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
      name: 'Solana',
    },
    logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
    puffList: [
      {
        name: 'Maga(Trump)',
        liquidity24h: '$3.5M',
        volume: '$9.3M',
        aget: '2mo 27d',
      },
      {
        name: 'Maga(Trump)',
        liquidity24h: '$3.5M',
        volume: '$9.3M',
        aget: '2mo 27d',
      },
    ],
  })

  const chainList = (list: Chain[]) => {
    return list.map((chain, i) => {
      return (
        <div key={i} className="flex justify-between">
          <div className="w-full flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Avatar
                src={chain.chain.logo}
                alt="Logo"
                className="w-[25px] h-[25px] object-cover rounded-full mr-2"
              />
              <div className="">
                {chain.puffList.length > 0 ? (
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => {
                      setShowPuff(true)
                      setChainInfo(chain)
                    }}
                  >
                    {t('cream.puff').replace('$1', `${chain.puffList.length}`)}
                  </span>
                ) : (
                  <span>{t('no.opponent')}</span>
                )}
              </div>
            </div>
            <span className="text-blue-600 cursor-pointer">
              {chain.puffList.length > 0
                ? t('create.new.token')
                : t('take,lead')}
            </span>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="px-2  max-sm:px-3">
      {chainList(chains.slice(0, 4))}
      {chains.length > 4 ? (
        <div
          className="text-gray-500 text-sm text-center cursor-pointer"
          onClick={() => {
            setShowMore(true)
          }}
        >
          {t('more...')}
        </div>
      ) : null}

      <Dialog
        open={showMore}
        onOpenChange={() => setShowMore(false)}
        contentProps={{ className: 'max-w-[350px]' }}
      >
        <DialogTitle>{data.title}</DialogTitle>
        <div>{chainList(chains)}</div>
      </Dialog>

      <Dialog
        open={showPuff}
        onOpenChange={() => setShowPuff(false)}
        contentProps={{}}
      >
        <DialogTitle>{data.title}</DialogTitle>
        <div className="flex items-center">
          <img
            src={chainInfo.chain.logo}
            alt="Logo"
            className="w-[35px] h-[35px] rounded-full object-cover"
          />
          <span className="mx-2">
            {t('cream.puff').replace('$1', `${chainInfo.puffList.length}`)}
          </span>
          <img
            src={chainInfo.logo}
            alt="Logo"
            className="w-[35px] h-[35px] rounded-sm object-cover"
          />
        </div>
        {chainInfo.puffList?.map((puff, key) => {
          return (
            <div key={key} className="mt-0">
              <div className="text-blue-600">{puff.name}</div>
              <div className="">
                {t('liquidity')}
                {puff.liquidity24h} 24H {t('volume')}: {puff.volume} {t('aget')}
                : {puff.aget}
              </div>
            </div>
          )
        })}
      </Dialog>
    </div>
  )
}
