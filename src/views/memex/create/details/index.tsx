import { useRouter } from 'next/router'

import { Form } from '@/components/ui/form'
import { useCreateIdeaDetails } from './hooks/use-create-idea-details'
import { CreateIdeaIntro } from '../components/idea-intro'
import { CreateIdeaDetailsProvider } from '@/contexts/memex/create-idea-detail'
import { CreateIdeaDetailsHeader } from './components/idea-details-header'
import { RequiredFields } from './components/required-fields'
import { OptionalFields } from './components/optional-fields'
import { MarketingField } from '@/components/marketing-field'
import { useCreateIdeaCleanup } from '../hooks/use-create-idea-cleanup'
import { useMemexStore } from '@/stores/use-memex'
import { InitialBuyField } from './components/initial-buy-field'
import { getMemexLayout } from '../..'

export const CreateDetailPage = () => {
  const craeteDetail = useCreateIdeaDetails()
  const { form, onSubmit, isUpdating } = craeteDetail
  const { idea } = useMemexStore()
  const { query } = useRouter()
  const chainName = (idea?.chain || query.chain || '') as string

  useCreateIdeaCleanup()

  return (
    <CreateIdeaDetailsProvider value={craeteDetail}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 pb-3 px-3">
          <CreateIdeaDetailsHeader />
          <RequiredFields />
          <InitialBuyField />
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
  )
}

CreateDetailPage.getLayout = getMemexLayout

export default CreateDetailPage
