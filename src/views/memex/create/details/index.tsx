import { useRouter } from 'next/router'

import { Form } from '@/components/ui/form'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useCreateIdeaDetails } from './hooks/use-create-idea-details'
import { CreateIdeaIntro } from '../components/idea-intro'
import { CreateIdeaDetailsProvider } from '@/contexts/memex/create-idea-detail'
import { CreateIdeaDetailsHeader } from './components/idea-details-header'
import { RequiredFields } from './components/required-fields'
import { OptionalFields } from './components/optional-fields'
import { MarketingField } from '@/components/marketing-field'
import { useCreateIdeaCleanup } from '../hooks/use-create-idea-cleanup'
import { useMemexStore } from '@/stores/use-memex'

export const CreateDetail = () => {
  const craeteDetail = useCreateIdeaDetails()
  const { form, onSubmit, isUpdating } = craeteDetail
  const { idea } = useMemexStore()
  const { query } = useRouter()
  const chainName = (idea?.chain || query.chain || '') as string

  useCreateIdeaCleanup()

  return (
    <PrimaryLayout className="w-full">
      <CreateIdeaDetailsProvider value={craeteDetail}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 pb-3">
            <CreateIdeaDetailsHeader />
            <RequiredFields />
            <MarketingField
              form={form}
              chainName={chainName}
              disabled={isUpdating}
            />
            <OptionalFields />
            <CreateIdeaIntro />
          </form>
        </Form>
      </CreateIdeaDetailsProvider>
    </PrimaryLayout>
  )
}

export default CreateDetail
