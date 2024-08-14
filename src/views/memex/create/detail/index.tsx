import React from 'react'

import { Form } from '@/components/ui/form'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useCreateDetail } from './hooks/use-create-detail'
import { CreateTweetIntro } from '../components/create-tweet-intro'
import { CreateDetailProvider } from '@/contexts/memex/create-detail'
import { CreateDetailHeader } from './components/create-detail-header'
import { RequiredFields } from './components/required-fields'
import { OptionalFields } from './components/optional-fields'
import { MarketingField } from '@/components/marketing-field'
import { useMemexClear } from '../hooks/use-memex-clear'

export const CreateDetail = () => {
  const craeteDetail = useCreateDetail()
  const { form, onSubmit } = craeteDetail

  useMemexClear()

  return (
    <PrimaryLayout className="w-full">
      <CreateDetailProvider value={craeteDetail}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 pb-3">
            <CreateDetailHeader />
            <RequiredFields />
            <MarketingField form={form} />
            <OptionalFields />
            <CreateTweetIntro />
          </form>
        </Form>
      </CreateDetailProvider>
    </PrimaryLayout>
  )
}

export default CreateDetail
