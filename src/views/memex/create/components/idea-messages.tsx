import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { utilLang } from '@/utils/lang'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { memexCreateConfig } from '@/config/memex/idea'

export const CreateIdeaMessages = () => {
  const { t } = useTranslation()
  const { form } = useCreateIdeaContext()
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
          {utilLang.replace(t('memex.create-message2'), [
            memexCreateConfig.minChar,
          ])}
        </p>
      )}
      {errors.pictures && <p>{t('memex.create-message3')}</p>}
    </div>
  )
}

export default CreateIdeaMessages
