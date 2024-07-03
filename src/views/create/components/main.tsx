import React from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Title } from './title'
import { AIIdeaBar } from '@/components/ai-idea-bar'
import { CreateTokenForm } from './form/form'
import { MobileQpportunityMoonshot } from '@/components/opportunity-moonshot'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'
import { useCreateTokenContext } from '@/contexts/create-token'

interface Props {
  className?: string
  tab: number
  setTab: (tab: number) => void
}

export const CreateTokenMain = (props: Props) => {
  const { className } = props
  const { t } = useTranslation()

  const {
    show,
    isRandom,
    value,
    onInputGen,
    onRandomGen,
    onCancel,
    onConfirm,
  } = useGenAIIdea()
  return (
    <div
      className={cn(
        'w-96 pr-6 max-md:w-[480px] max-sm:w-full max-sm:px-0  max-sm:mb-5',
        className
      )}
    >
      <Title className="w-fit max-sm:mt-3">{t('create.new')}</Title>
      <div className="sm:hidden">
        <MobileQpportunityMoonshot defalutTab={1}></MobileQpportunityMoonshot>
      </div>

      <AIIdeaBar
        className="mt-5 w-fit"
        onInputGen={onInputGen}
        onRandomGen={onRandomGen}
      ></AIIdeaBar>

      <AICreateMemecoinDialog
        show={show}
        data={{ name: value }}
        isRandom={isRandom}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
      {/* All input/textarea */}
      <CreateTokenForm />
    </div>
  )
}
