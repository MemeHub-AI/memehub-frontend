import { useTranslation } from 'react-i18next'

import { defaultImg } from '@/config/link'
import { Card } from './ui/card'
import { Img } from './img'
import { CommunityListItem } from '@/api/alliance/type'
import { utilLang } from '@/utils/lang'
import { useCommunityMembers } from '@/hooks/use-community-members'

interface Props {
  data?: CommunityListItem
}

export const CommunityCard = ({ data }: Props) => {
  const { t } = useTranslation()
  // const { members } = useCommunityMembers(data?.id)

  return (
    <Card className="p-4 hover:scale-102" shadow="none" onClick={() => {}}>
      <div className="flex space-x-4 relative">
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
          {data?.kol && (
            <div className="flex items-center space-x-2">
              {t('founder')}:
              <span className="text-violet-600 font-bold ml-2">
                {utilLang.locale(data?.kol?.name)}
              </span>
              <img src="/images/check.png" alt="check" className="w-5" />
            </div>
          )}
        </div>
      </div>
      {/* <div className="mt-2">
        {t('community.count')}: <span className="font-bold">{members}</span>
      </div> */}
      <div className="break-all line-clamp-2 mt-2" title={data?.description}>
        {data?.description}
      </div>
    </Card>
  )
}

export default CommunityCard
