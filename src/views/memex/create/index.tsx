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
import { useMemexClear } from './hooks/use-memex-clear'
import { MemexIdeaItem } from '@/api/memex/types'

export const CreateIdeaPage = () => {
  const createTweet = useCreateIdea()
  const { form, onSubmit } = createTweet
  const { ideaDetails } = useMemexStore()
  const { query, ...router } = useRouter()

  useMemexClear()

  return (
    <PrimaryLayout padding={false} mainClass="flex">
      <CreateIdeaProvider value={createTweet}>
        <Form {...form}>
          <form
            className="flex-1 pt-1 pb-3"
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
                  onClick={() =>
                    router.push({
                      pathname: Routes.MemexCreateDetails,
                      query,
                    })
                  }
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
