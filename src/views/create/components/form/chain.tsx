import { useEffect, useState } from 'react'
import { IoIosMore } from 'react-icons/io'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { useAccount, useSwitchChain } from 'wagmi'
import { isEmpty } from 'lodash'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateTokenForm } from '../../hooks/use-form'
import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useChainsStore } from '@/stores/use-chains-store'

interface Props {
  formData: ReturnType<typeof useCreateTokenForm>
}

export const FormChain = ({ formData }: Props) => {
  const { form, formFields } = formData
  const { switchChainAsync } = useSwitchChain()
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const { chains, findChain } = useChainsStore()
  const { chainId } = useAccount()

  const isSelect = (v: string) => {
    return chains.findIndex((c) => c.name === v) > 6
  }

  const switchChain = (id: string, name: string) => {
    switchChainAsync({ chainId: Number(id) })
      .then(() => {
        // Only success can change the chain.
        form?.setValue(formFields?.chainName, name)
      })
      .catch(() => {})
  }

  // Default select.
  useEffect(() => {
    if (!chainId || isEmpty(chains)) return

    const chain = findChain(chainId)
    if (!chain) return

    form.setValue(formFields.chainName, chain.name)
  }, [chainId, chains])

  return (
    <FormField
      control={form?.control}
      name={formFields?.chainName!}
      render={({ field }) => (
        <FormItem className="mt-0">
          <FormLabel className="mt-0 font-bold">
            *{fmt.withChain(findChain(field.value)?.displayName)}
          </FormLabel>
          <FormControl>
            {chains ? (
              <RadioGroup
                defaultValue={field.value}
                className="flex w-max gap-0 border-2 border-black rounded-md overflow-hidden flex-wrap max-w-[300px] max-sm:w-max"
              >
                {chains.slice(0, 7)?.map((c, i) => (
                  <FormItem
                    key={i}
                    title={c.name}
                    className={cn(
                      'block p-1 min-w-[35px]',
                      c.name === field.value! ? 'bg-black' : '',
                      i !== chains.length - 1 ? 'border-r-2 border-black' : ''
                    )}
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={c.name}
                        disabled={!c.is_supported}
                        onClick={() => switchChain(c.id, c.name)}
                      >
                        <img
                          src={c.logo}
                          alt={c.name}
                          about={c.name}
                          className={cn(
                            'w-[27px] h-[27px] block rounded-full overflow-hidden',
                            'max-sm:w-[24px] max-sm:h-[24px]',
                            !c.is_supported && 'opacity-50 cursor-not-allowed'
                          )}
                        />
                      </RadioGroupItem>
                    </FormControl>
                  </FormItem>
                ))}

                {chains.length > 7 && (
                  <div
                    className={clsx(
                      'w-[35px] flex justify-center items-center cursor-pointer hover:bg-gray-100',
                      isSelect(field.value! as string)
                        ? '!bg-black !text-white'
                        : ''
                    )}
                    onClick={() => setShow(true)}
                  >
                    <Select
                      open={show}
                      onOpenChange={() => setShow(false)}
                      value={field.value as string}
                      onValueChange={(v) => {
                        setShow(false)
                        const chain = findChain(v)
                        if (!chain) return
                        switchChain(chain.id, chain.name)
                      }}
                    >
                      <SelectTrigger
                        showArrow={false}
                        className="!border-0 !rounded-none !p-0 !translate-x-0 !translate-y-0 flex justify-center items-center"
                      >
                        {isSelect(field.value! as string) ? (
                          <img
                            src={findChain(field.value as string)?.logo}
                            className="w-[27px] h-[27px] bg-black"
                          />
                        ) : (
                          <IoIosMore size={30} />
                        )}
                      </SelectTrigger>
                      <SelectContent className="min-w-2">
                        {chains.slice(7)?.map((c) => (
                          <SelectItem
                            showCheck={false}
                            isActive={c.name === field.value}
                            key={c.name}
                            value={c.name}
                            className="mb-1"
                          >
                            <img
                              src={c.logo}
                              alt="Logo"
                              className="w-[27px] h-[27px]"
                            />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </RadioGroup>
            ) : (
              <div>{t('loading')}</div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
