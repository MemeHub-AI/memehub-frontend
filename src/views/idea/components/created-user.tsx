import { IdeaDataList, IdeaTokens } from '@/api/idea/type'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  data: IdeaDataList
}

export const CreatedUser = ({ data }: Props) => {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  const handleList = (list: IdeaTokens[]) => {
    return list.map((user) => {
      return (
        <div className=" mt-2 flex justify-between items-center ">
          <div className="flex items-center">
            <img
              src={user.logo}
              alt="Logo"
              className="w-[25px] h-[25px] object-cover rounded-md mr-2"
            />
            <span>{user.name}</span>
          </div>
          <div className="">
            <span className="text-sm text-blue-600 cursor-pointer">
              {t('live.in.up')}
            </span>
          </div>
        </div>
      )
    })
  }

  if (!data.tokens.length) return null

  return (
    <>
      <div className="border-t my-2"></div>
      <div className="px-2 max-sm:px-3">
        <span className="text-gray-500">{t('in.memehub')}</span>
        <div className="mt-2 mb-1">{handleList(data.tokens.slice(0, 4))}</div>
        {data.tokens.length > 4 ? (
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
          <DialogTitle>{data.name}</DialogTitle>
          <div>{handleList(data.tokens)}</div>
        </Dialog>
      </div>
    </>
  )
}
