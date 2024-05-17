import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'

import { CreateTokenForm } from './components/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'

export const CreatePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()

  return (
    <main className="min-h-main flex flex-col items-center">
      <h2
        className={cn(
          'font-bold text-3xl my-6 w-96 text-center relative',
          'max-sm:w-full max-sm:my-4'
        )}
      >
        <Button
          size="icon"
          variant={isMobile ? 'outline' : 'ghost'}
          className="absolute left-0 max-sm:left-3"
          onClick={router.back}
        >
          <ChevronLeftIcon />
        </Button>
        {t('token.create.new')}
      </h2>
      <CreateTokenForm />
    </main>
  )
}

export default CreatePage
