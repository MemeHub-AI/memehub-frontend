import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { useCreateIdea } from './hooks/use-create-idea'
import { CreateIdeaProvider } from '@/contexts/memex/create-idea'
import { Form } from '@/components/ui/form'
import { CreateIdeaHeader } from './components/idea-header'
import { CreateIdeaTextareaField } from './components/fields/textarea-field'
import { CreateIdeaPicturesField } from './components/fields/pictures-field'
import { CreateIdeaChainField } from './components/fields/chain-field'
import { CreateIdeaDetailButton } from './components/idea-detail-button'
import { CreateIdeaMessages } from './components/idea-messages'
import { CreateIdeaIntro } from './components/idea-intro'
import { useMemexStore } from '@/stores/use-memex'
import { TokenDetailsCard } from '../components/token-detail-card'
import { Routes } from '@/routes'
import { useCreateIdeaCleanup } from './hooks/use-create-idea-cleanup'
import { MemexIdeaItem } from '@/api/memex/types'

export const CreateIdeaPage = () => {
  const createIdea = useCreateIdea()
  const { form, onSubmit } = createIdea
  const { ideaDetails, setIdea } = useMemexStore()
  const { query, ...router } = useRouter()

  useCreateIdeaCleanup()

  return (
    <PrimaryLayout padding={false} mainClass="flex">
      <CreateIdeaProvider value={createIdea}>
        <Form {...form}>
          <form
            className="flex-1 pt-1 pb-3 xl:max-w-4xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CreateIdeaHeader />
            <CreateIdeaTextareaField />

            <div className="px-3 mt-1 space-y-2">
              <CreateIdeaChainField />

              <div className="flex space-x-2">
                <CreateIdeaPicturesField />
                {!ideaDetails && <CreateIdeaDetailButton />}
              </div>

              {!!ideaDetails && (
                <TokenDetailsCard
                  className="pb-0"
                  details={ideaDetails as unknown as MemexIdeaItem}
                  editable={true}
                  onClick={() => {
                    const values = form.getValues()

                    setIdea({ ...values, image_urls: values.pictures })
                    router.push({
                      pathname: Routes.MemexCreateDetails,
                      query: { chain: values.chain },
                    })
                  }}
                />
              )}
              <CreateIdeaMessages />
              <CreateIdeaIntro />
            </div>
          </form>
        </Form>
      </CreateIdeaProvider>
    </PrimaryLayout>
  )
}

export default CreateIdeaPage
