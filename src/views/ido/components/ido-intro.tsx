import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { utilLang } from '@/utils/lang'
import { useIdoContext } from '@/contexts/ido'

export const IdoIntro = ({ className }: ComponentProps<'div'>) => {
  const { t, i18n } = useTranslation()
  const { totalReserveAmount, reserveSymbol } = useIdoContext()

  return (
    <div
      className={cn(
        'bg-black text-white py-6 relative z-10 flex flex-col items-center sm:py-10',
        className
      )}
    >
      <div className="sm:max-w-md">
        <h3 className="text-xl font-semibold text-center">
          {utilLang.replace(t('ido.intro.title1'), [
            `${totalReserveAmount} ${reserveSymbol}`,
          ])}
        </h3>
        <p className="mt-3">{t('ido.intro1')}</p>
        <p className="mt-2">{t('ido.intro2')}</p>
        <img
          src={`/images/ido/${i18n.language}/meme1.jpeg`}
          alt="meme"
          className="w-full mt-3"
        />

        <h3 className="text-xl font-semibold mt-6 text-center">
          Trump407 = 404 + {t('ido.burn')}
        </h3>
        <p className="mt-3">{t('ido.intro3')}</p>
        <p className="mt-2">{t('ido.intro4')}</p>
        <img
          src={`/images/ido/${i18n.language}/intro.png`}
          alt="intro"
          className="w-full mt-3"
        />

        <h3 className="text-xl font-semibold mt-6 text-center">
          {t('ido.intro.title3')}
        </h3>
        <h3 className="text-xl font-semibold text-center">
          {t('ido.intro.title4')}
        </h3>
        <p className="mt-3">{t('ido.intro5')}</p>
        <p className="mt-2">
          {utilLang.replace(t('ido.intro6'), ['70%', '30%'])}
        </p>
        <p className="mt-2">{utilLang.replace(t('ido.intro7'), ['1.5%'])}</p>
        {/* <p className="self-start mt-2">{t('ido.intro8')}</p>
        <p className="self-start mt-2">
          1 + 2 + 3 = {utilLang.replace(t('ido.redeem'), ['5%'])}
        </p>
        <p className="self-start">
          1 + 2 + 3 + 4 + 5 = {utilLang.replace(t('ido.redeem'), ['10%'])}
        </p>
        <p className="self-start">
          1 + 2 + 3 + 4 + 5 + 6 + 7 ={' '}
          {utilLang.replace(t('ido.redeem'), ['30%'])}
        </p>
        <p className="self-start">
          1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 ={' '}
          {utilLang.replace(t('ido.redeem'), ['90%'])}
        </p> */}
        <img
          src="/images/ido/nft.gif"
          alt="nft"
          className="w-full mt-3 rounded-md"
        />
      </div>
    </div>
  )
}

export default IdoIntro
