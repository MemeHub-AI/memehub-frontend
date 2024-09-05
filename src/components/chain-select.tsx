import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IoIosMore } from 'react-icons/io'

import { useTranslation } from 'react-i18next'
import { useChainId, useSwitchChain } from 'wagmi'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainData } from '@/api/chain/type'
import { Network } from '@/enums/contract'

interface Props extends Omit<ComponentProps<typeof RadioGroup>, 'onChange'> {
  onChange?: (chain: ChainData) => void
}

export const ChainSelect = forwardRef<HTMLDivElement, Props>((p, ref) => {
  const { className, defaultValue, value, onChange, onValueChange, ...props } =
    p
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { switchChainAsync } = useSwitchChain()
  const { loadingChains, chains, evmChainsMap } = useChainsStore()
  const chainId = useChainId()

  const isSelected = useMemo(() => {
    const idx = chains.findIndex((c) => {
      const v = value || defaultValue || chainId.toString()
      return v === c.id || v === c.name
    })
    return idx > 6
  }, [chains, value, defaultValue])

  const isChainSelected = (c: Partial<ChainData>) => {
    const v = value || defaultValue || chainId.toString()
    return v === c.id || v === c.name
  }

  const switchChain = (c: ChainData | undefined) => {
    if (!c) return
    if (Network.Evm === c.network) {
      switchChainAsync({ chainId: +c.id })
        .then(() => onChange?.(c))
        .catch(() => {})
    } else {
      onChange?.(c)
    }
  }

  useEffect(() => {
    const strId = chainId.toString()
    const chain = evmChainsMap[strId]

    if (isChainSelected({ id: strId }) && chain) {
      onChange?.(chain)
    }
  }, [evmChainsMap])

  if (loadingChains) return <div>{t('loading')}</div>

  return (
    <RadioGroup
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        'flex w-max gap-0 border-2 border-black rounded-md overflow-hidden flex-wrap max-w-[300px] max-sm:w-max',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {chains.slice(0, 7)?.map((c, i) => (
        <RadioGroupItem
          key={c.name}
          value={c.id}
          title={c.displayName}
          className={cn(
            'flex items-center justify-center min-w-9 p-0 min-h-8',
            chains.length - 1 !== i && 'border-r-2 border-black',
            isChainSelected(c) && 'bg-black'
          )}
          onClick={() => switchChain(c)}
        >
          <img
            src={c.logo}
            alt={c.displayName}
            className="w-7 h-7 rounded-full"
          />
        </RadioGroupItem>
      ))}

      {chains.length > 7 && (
        <div
          className={cn(
            'w-9 flex justify-center items-center cursor-pointer hover:bg-gray-100',
            isSelected && 'bg-black text-white hover:bg-black'
          )}
          onClick={() => setOpen(true)}
        >
          <Select
            open={open}
            onOpenChange={setOpen}
            value={value}
            onValueChange={(v) => {
              setOpen(false)
              switchChain(evmChainsMap[v])
            }}
            disabled={props.disabled}
          >
            <SelectTrigger
              showArrow={false}
              className="!border-0 !rounded-none !p-0 !translate-x-0 !translate-y-0 flex justify-center items-center h-8"
            >
              {isSelected ? (
                <img
                  src={evmChainsMap[value || defaultValue || '']?.logo}
                  alt="chain"
                  className="w-6 h-6 bg-black"
                />
              ) : (
                <IoIosMore size={28} />
              )}
            </SelectTrigger>
            <SelectContent className="min-w-2">
              {chains.slice(7)?.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                  showCheck={false}
                  isActive={isChainSelected(c)}
                  className={cn(isChainSelected(c) && 'mb-1 hover:!bg-black')}
                  title={c.displayName}
                >
                  <img src={c.logo} alt={c.displayName} className="w-6 h-6" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </RadioGroup>
  )
})
