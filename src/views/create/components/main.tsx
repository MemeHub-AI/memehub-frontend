import React, { useEffect, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Title } from './title'
import { AIIdea } from '@/views/main/components/ai-idea'
import { CreateTokenForm } from './form'
import { formFields, useCreateTokenForm } from '../hooks/use-form'
import { useDeploy } from '../hooks/use-deploy'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { useRouter } from 'next/router'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
  newsListData: ReturnType<typeof useNewsList>
  aIMemeInfo: ReturnType<typeof useAIMemeInfo>
}

export const Main = (props: Props) => {
  const { className, aIMemeInfo } = props
  const { query } = useRouter()
  const { t } = useTranslation()
  const {
    getAIMemeInfo,
    isLoadingMemeImg,
    isLoadingMemeInfo,
    isLoadingMemePoster,
  } = aIMemeInfo

  useEffect(() => {
    if (!query?.title || !formFields.fullname || isLoadingMemeInfo) {
      return
    }
    getAIMemeInfo(query.title! as string)
  }, [query])

  return (
    <div
      className={cn(
        'w-96 pr-6 max-md:w-[480px] max-sm:w-full max-sm:px-4',
        className
      )}
    >
      <Title className="w-fit max-sm:mt-10">{t('create.new')}</Title>

      <AIIdea
        className="mt-5"
        getAIMemeInfo={getAIMemeInfo}
        isLoadingMemeInfo={isLoadingMemeInfo}
      ></AIIdea>

      {/* All input/textarea */}
      <CreateTokenForm
        newsListData={props.newsListData}
        formData={props.formData}
        deployResult={props.deployResult}
        isLoadingMemeImg={isLoadingMemeImg}
        isLoadingMemePoster={isLoadingMemePoster}
        isLoadingMemeInfo={isLoadingMemeInfo}
      />
    </div>
  )
}
