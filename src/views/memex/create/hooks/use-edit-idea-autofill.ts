import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useMemexStore } from '@/stores/use-memex'
import { useIdeaDetails } from '../../idea/hooks/use-idea-details'

export const useEditIdeaAutofill = () => {
  const { query } = useRouter()
  const { setIdea, setIdeaDetails } = useMemexStore()

  const hash = query.hash as string
  const { details } = useIdeaDetails(hash)

  useEffect(() => {
    if (!details) return

    setIdea(details)
    setIdeaDetails({
      name: details.name || '',
      symbol: details.symbol || '',
      logo_url: details.logo_url || '',
      description: details.description || '',
      twitter_url: details.twitter_url || '',
      telegram_url: details.telegram_url || '',
      website_url: details.website_url || '',
      airdrop_marketing: details.airdrop_marketing || [],
      initialBuyAmount: '',
    })
  }, [details])

  return {}
}
