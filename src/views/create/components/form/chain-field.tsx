import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { isEmpty } from 'lodash'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { fmt } from '@/utils/fmt'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainSelect } from '@/components/chain-select'
import { useCreateTokenContext } from '@/contexts/create-token'

export const ChainField = () => {
  const { chainId, chain } = useAccount()
  const { formData } = useCreateTokenContext()
  const { form, formFields } = formData
  // TODO: may need to compatible the all chains
  const { chains, evmChainsMap } = useChainsStore()

  // Default select.
  useEffect(() => {
    if (!chainId || isEmpty(chains)) return
    if (!evmChainsMap[chainId]) return

    form.setValue(formFields.chainName, evmChainsMap[chainId].name)
  }, [chainId, evmChainsMap])

  return (
    <FormField
      control={form.control}
      name={formFields.chainName}
      render={({ field }) => (
        <FormItem className="mt-0">
          <FormLabel className="mt-0 font-bold">
            *
            {fmt.withChain(
              evmChainsMap[field.value]?.displayName || chain?.name
            )}
          </FormLabel>
          <FormControl>
            <ChainSelect
              defaultValue={chainId?.toString()}
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
