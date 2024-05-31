import { Avatar } from '@/components/ui/avatar'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const ChainInfo = () => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  const chains = new Array(Math.floor(Math.random() * 5) + 1).fill({
    logo: 'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/12b5ad678cfabc39e1d2c372d788f7c42.avif',
    name: 'IVANKA',
    cream: 1,
  })

  return (
    <div className="px-2  max-sm:px-3">
      {chains.slice(0, showMore ? chains.length : 4).map((chain, i) => {
        return (
          <div key={i} className="flex justify-between">
            <div className="w-full flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Avatar
                  src={chain.logo}
                  alt="Logo"
                  className="w-[25px] h-[25px] object-cover rounded-full mr-2"
                />
                <div className="">
                  {chain.cream > 0 ? (
                    <span className="text-blue-600 underline cursor-pointer">
                      {t('cream.puff').replace('$1', `${chain.cream}`)}
                    </span>
                  ) : (
                    <span>{t('no.opponent')}</span>
                  )}
                </div>
              </div>
              <span className="text-blue-600 cursor-pointer">
                {chain.cream > 0 ? t('create.new.token') : t('take,lead')}
              </span>
            </div>
          </div>
        )
      })}
      {chains.length > 4 ? (
        <div
          className="text-gray-500 text-sm text-center cursor-pointer"
          onClick={() => setShowMore(true)}
        >
          {t('more...')}
        </div>
      ) : null}
    </div>
  )
}
