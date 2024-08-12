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

export const CreateTweet = () => {
  const createTweet = useCreateTweet()
  const { form, onSubmit } = createTweet

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
                <CreateTokenDetail />
              </div>

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
