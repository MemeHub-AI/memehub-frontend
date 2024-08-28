import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { IdeaDataList, IdeaTokens } from '@/api/idea/type'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Routes } from '@/routes'
import { Img } from '@/components/img'
import { joinPaths } from '@/utils'

interface Props {
  ideaData: IdeaDataList | undefined
}

export const TokenList = ({ ideaData }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)

  const handleList = (tokenList: IdeaTokens[]) => {
    return tokenList.map((token) => {
      return (
        <div className="mt-2 flex justify-between items-center" key={token.id}>
          <div className="flex items-center max-w-[70%]">
            <Img
              src={token.image_url}
              alt="Logo"
              className="w-[25px] h-[25px] object-cover rounded-md mr-2"
            />
            <span className="whitespace-nowrap truncate">{token.name}</span>
          </div>
          <div className="whitespace-nowrap">
            <span
              className="text-sm text-blue-600 cursor-pointer select-none"
              onClick={() => {
                if (isEmpty(token.chain) || isEmpty(token.contract_address))
                  return
                open(
                  joinPaths(Routes.Main, token.chain, token.contract_address)
                )
              }}
            >
              {t('live.in.up')}
            </span>
          </div>
        </div>
      )
    })
  }

  if (!ideaData?.tokens.length) return null

  return (
    <>
      <div className="border-t my-2"></div>
      <div className="px-2 max-sm:px-3">
        <span className="text-gray-500">{t('in.memehub')}</span>
        <div className="mt-2 mb-1">
          {handleList(ideaData.tokens.slice(0, 4))}
        </div>
        {ideaData.tokens.length > 4 ? (
          <div
            className="text-sm text-gray-500 text-center cursor-pointer"
            onClick={() => setShowMore(true)}
          >
            {t('more...')}
          </div>
        ) : null}

        <Dialog
          open={showMore}
          onOpenChange={() => setShowMore(false)}
          contentProps={{ className: 'max-w-[350px]' }}
        >
          <DialogTitle>{ideaData.name}</DialogTitle>
          <div>{handleList(ideaData.tokens)}</div>
        </Dialog>
      </div>
    </>
  )
}
