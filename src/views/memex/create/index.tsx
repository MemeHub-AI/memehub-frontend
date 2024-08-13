import React from 'react'

import { PrimaryLayout } from '@/components/layouts/primary'
import { useCreateTweet } from './hooks/use-create-tweet'
import { CreateTweetProvider } from '@/contexts/memex/create-tweet'
import { Form } from '@/components/ui/form'
import { CreateHeader } from './components/create-header'
import { CreateTextareaField } from './components/fields/textarea-field'
import { CreatePicturesField } from './components/fields/pictures-field'
import { CreateChainField } from './components/fields/chain-field'
import { CreateTokenDetail } from './components/token-detail'
import { CreateTweetMessages } from './components/create-tweet-messages'
import { CreateTweetIntro } from './components/create-tweet-intro'
import { useMemexStore } from '@/stores/use-memex'
import { TokenDetailCard } from '../components/token-detail-card'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { useMemexClear } from './hooks/use-memex-clear'

export const CreateTweet = () => {
  const createTweet = useCreateTweet()
  const { form, onSubmit } = createTweet
  const { tweetDetails } = useMemexStore()
  const router = useRouter()

  useMemexClear()

  return (
    <PrimaryLayout padding={false} mainClass="flex">
      <CreateTweetProvider value={createTweet}>
        <Form {...form}>
          <form
            className="flex-1 pt-1 pb-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CreateHeader />
            <CreateTextareaField />

            <div className="px-3 mt-1 space-y-2">
              <CreateChainField />

              <div className="flex space-x-2">
                <CreatePicturesField />
                {!tweetDetails && <CreateTokenDetail />}
              </div>

              {!!tweetDetails && (
                <TokenDetailCard
                  className="pb-0"
                  details={tweetDetails}
                  editable={true}
                  onClick={() => router.push(Routes.MemexCreateDetail)}
                />
              )}
              <CreateTweetMessages />
              <CreateTweetIntro />
            </div>
          </form>
        </Form>
      </CreateTweetProvider>
    </PrimaryLayout>
  )
}

export default CreateTweet
