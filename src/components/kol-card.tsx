import { useTranslation } from 'react-i18next'

import { defaultImg } from '@/config/link'
import { Card } from './ui/card'
import { Img } from './img'
import { URL_TYPE, utilsUrl } from '@/utils/url'
import { KolListItem } from '@/api/alliance/type'
import { utilLang } from '@/utils/lang'
import { IdTag } from './id-tag'

interface Props {
  data?: KolListItem
}

export const KolCard = ({ data }: Props) => {
  const { t } = useTranslation()

  return (
    <Card
      className="p-4 hover:scale-102"
      shadow="none"
      onClick={() => {
        if (!data?.twitter_url && !data?.telegram_url) return
        open(
          utilsUrl.mediaUrl(data?.twitter_url, URL_TYPE.TWITTER) ||
            utilsUrl.mediaUrl(data?.telegram_url, URL_TYPE.TELEGRAM)
        )
      }}
    >
      <div className="flex space-x-4 relative">
        <img
          src="/images/x.png"
          alt="x"
          className="absolute top-0 right-0"
          onClick={() =>
            open(utilsUrl.mediaUrl(data?.twitter_url, URL_TYPE.TWITTER))
          }
        />
        <Img
          src={data?.logo || defaultImg}
          alt="Avatar"
          className="w-16 h-16 shrink-0 rounded-full border-2 border-black !ml-0"
        />
        <div className="flex flex-col">
          <h2
            className="text-xl max-sm:text-xl break-all line-clamp-2 font-bold"
            title={utilLang.locale(data?.name)}
          >
            {utilLang.locale(data?.name)}
          </h2>
          <IdTag src={data?.logo} title={data?.name.en} imgClass="w-8 h-8" />
        </div>
      </div>
      <div className="my-2">
        {t('community.count')}: <span className="font-bold">{123}</span>
      </div>
      <div className="break-all line-clamp-2" title={data?.description}>
        {data?.description}
      </div>
    </Card>
  )
}
