import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { fmt } from '@/utils/fmt'
import { ChainSelect } from '@/components/chain-select'
import { useCreateTokenContext } from '@/contexts/create-token'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useChainsStore } from '@/stores/use-chains-store'

export const ChainField = () => {
  const { form, formFields } = useCreateTokenContext()
  const { chainId = 0 } = useAccount()
  const { evmChainsMap } = useChainsStore()
  const { chainName, displayName } = useChainInfo(
    // TODO/middle: multi chain like `sol`
    form.watch('chainName') || evmChainsMap[chainId]?.name
  )

  // Default select.
  useEffect(() => {
    if (!chainId) return
    form.setValue('chainName', chainName)
  }, [chainId, chainName])

  return (
    <FormField
      control={form.control}
      name={formFields.chainName}
      render={({ field }) => (
        <FormItem className="mt-0">
          <FormLabel className="mt-0 font-bold">
            *{fmt.withChain(displayName)}
          </FormLabel>
          <FormControl>
            <ChainSelect
              defaultValue={chainName}
              value={field.value}
              onChange={(c) => field.onChange(c.name)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
