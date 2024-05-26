import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Title } from './title'
import { AIIdea } from '@/views/main/components/ai-idea'
import { CreateTokenForm } from './form'
import { useCreateTokenForm } from '../hooks/use-form'
import { useDeploy } from '../hooks/use-deploy'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
}

export const Main = (props: Props) => {
  const { className } = props
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'w-96 pr-6 max-md:w-[480px] max-sm:w-full max-sm:px-4',
        className
      )}
    >
      <Title className="w-fit max-sm:mt-10">{t('create.new')}</Title>

      <AIIdea className="mt-5"></AIIdea>

      {/* All input/textarea */}
      <CreateTokenForm
        formData={props.formData}
        deployResult={props.deployResult}
      />
    </div>
  )
}
