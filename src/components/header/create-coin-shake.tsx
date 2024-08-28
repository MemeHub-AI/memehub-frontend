import { useRouter } from 'next/router'
import { ShakeCardProps } from './type'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { TokenWsCreate } from '@/views/token/hooks/use-token-ws/types'
import { useTranslation } from 'react-i18next'
import { Routes } from '@/routes'
import { joinPaths } from '@/utils'
import { animatedShakeRef } from '@/utils/animation'

const CreateCoinShake = (props: ShakeCardProps<TokenWsCreate>) => {
  const { trade: create, className, textClass, imageClass, color } = props
  const { push } = useRouter()
  const { t } = useTranslation()

  const ShakeCard = useMemo(
    () => () => {
      return (
        <div
          style={{ backgroundColor: color }}
          className={cn(
            'p-2 flex gap-1 items-center rounded-sm text-white font-medium',
            className
          )}
          ref={animatedShakeRef}
        >
          <img
            src={create.image_url}
            className={cn('w-5 h-5 rounded-full object-cover', imageClass)}
          />
          <span className={cn('text-nowrap text-sm', textClass)}>
            <span
              className="hover:underline hover:underline-offset-1 hover:cursor-pointer"
              onClick={() =>
                push(
                  joinPaths(Routes.Main, create.chain, create.contract_address)
                )
              }
            >
              {create.name.length < 15
                ? create.name.slice(0, 15)
                : create.name.slice(0, 15) + '...'}
            </span>{' '}
            {/* {t('was.created')} */}
            was created {create.coin_type === 6 ? 'on Memex' : ''}
          </span>
        </div>
      )
    },
    [create]
  )

  return <ShakeCard />
}

export default CreateCoinShake
