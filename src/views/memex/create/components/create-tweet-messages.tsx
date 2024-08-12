import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { utilLang } from '@/utils/lang'
import { useCreateTweetContext } from '@/contexts/memex/create-tweet'
import { createTweetMinChar } from '../hooks/use-create-tweet'

export const CreateTweetMessages = () => {
  const { t } = useTranslation()
  const { form } = useCreateTweetContext()
  const {
    formState: { errors },
  } = form

  useEffect(() => {
    form.trigger('content')
    form.trigger('chain')
    form.trigger('pictures')
  }, [])

  return (
    <div className="text-green-700 font-semibold text-sm">
      {errors.chain && <p>{t('memex.create-message1')}</p>}
      {errors.content && (
        <p>
          {utilLang.replace(t('memex.create-message2'), [createTweetMinChar])}
        </p>
      )}
      {errors.pictures && <p>{t('memex.create-message3')}</p>}
    </div>
  )
}

export default CreateTweetMessages
