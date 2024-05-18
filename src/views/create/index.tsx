import React from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'
import { formatEther } from 'viem'
import Link from 'next/link'

import { CreateTokenForm } from './components/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'
import { useDeploy } from './hooks/use-deploy'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'

export const CreatePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()
  const {
    deployFee,
    deploySymbol,
    isDeploying,
    deployHash,
    isSuccess,
    deploy,
    resetDeploy,
  } = useDeploy()

  const fee = Number(formatEther(BigInt(deployFee))).toFixed(3)

  return (
    <main className="min-h-main flex flex-col items-center">
      <AlertDialog
        open={isSuccess}
        onOpenChange={resetDeploy}
        title={t('deploy.success')}
        description={
          <p className="flex flex-col gap-2">
            <Link
              className="text-blue-600 hover:underline "
              href={`https://scrollscan.com/tx/${deployHash}`}
              target="_blank"
            >
              {t('view.hash')}
            </Link>
            <Link
              className="text-blue-600 hover:underline "
              href={`${Routes.Token}/0x0c9fffc7749b49f0f482a4fa214d62cfddb4aad0`}
            >
              {t('view.details')}
            </Link>
          </p>
        }
      />
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
      <CreateTokenForm
        fee={fee}
        symbol={deploySymbol}
        disabeld={isDeploying}
        onSubmit={(f) => deploy(f.name, f.symbol)}
      />
    </main>
  )
}

export default CreatePage
