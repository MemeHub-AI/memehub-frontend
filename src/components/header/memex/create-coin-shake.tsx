import { useRouter } from 'next/router'
import { ShakeCardProps } from './type'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { TokenCreate } from '@/views/token/hooks/use-token-ws/types'
import { useTranslation } from 'react-i18next'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'

const CreateCoinShake = (props: ShakeCardProps<TokenCreate>) => {
  const { trade: create, className, textClass, imageClass, color } = props
  const { push } = useRouter()
  const { t } = useTranslation()

  const ShakeCard = useMemo(
    () => () => {
      console.log('create:', create)

      return (
        <div
          style={{ backgroundColor: color }}
          className={cn(
            'p-2 flex gap-1 items-center rounded-sm text-white font-medium animate-hori-shake',
            className
          )}
        >
          <img
            src={create.image_url}
            className={cn('w-5 h-5 rounded-full', imageClass)}
          />
          <span className={cn('text-nowrap text-sm', textClass)}>
            <span
              className="hover:underline hover:underline-offset-1 hover:cursor-pointer"
              onClick={() =>
                push(
                  fmt.toHref(Routes.Main, create.chain, create.contract_address)
                )
              }
            >
              {create.name.length < 15
                ? create.name.slice(0, 15)
                : create.name.slice(0, 15) + '...'}
            </span>{' '}
            {t('was.created')}
          </span>
        </div>
      )
    },
    [create]
  )

  return <ShakeCard />
}

export default CreateCoinShake