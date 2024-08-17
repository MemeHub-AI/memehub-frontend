import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { WalletInfo } from '@/config/wallets'
import { useWalletsList } from '@/hooks/use-wallets-list'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowUp, FaLongArrowAltUp } from 'react-icons/fa'
import { FaArrowDown } from 'react-icons/fa6'

export const WalletsCard = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { walletLists } = useWalletsList()
  const [wallets, setWallets] = useState<WalletInfo[]>([])

  useEffect(() => {
    const fetchWallets = async () => {
      const fetchedWallets = await walletLists()

      setWallets(fetchedWallets)
    }

    fetchWallets()
  }, [])

  return (
    <Card shadow={'none'} border={'none'} className="cursor-default">
      <CardHeader>
        <CardTitle>
          <p className="">{t('welcome')}</p>
        </CardTitle>
        <CardDescription>
          <p>{t('select.wellets')}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1">
          {wallets.map((wallet, index) => {
            if (!wallet.recommend) return
            return (
              <Button
                key={index}
                className="flex justify-between h-12 w-full font-semibold"
              >
                <span>{wallet.name}</span>
                <img src={wallet.icon} className="h-8 w-8" />
              </Button>
            )
          })}
        </div>
        {/* divide */}
        <div className="flex w-full space-x-2 mt-8 mb-6 justify-around items-center text-center">
          <p className="h-[2px] bg-black grow rounded-md " />
          <span>{t('or')}</span>
          <p className="bg-black h-[2px] grow rounded-md" />
        </div>

        <div
          className={cn(
            'grid gap-4 grid-cols-2',
            !isOpen ? 'max-h-14 overflow-hidden pr-1 pt-1' : ''
          )}
        >
          {wallets.map((wallet, index) => {
            if (wallet.recommend) return
            return (
              <Button
                key={index}
                className="flex justify-between h-12 w-full font-semibold"
              >
                <span>{wallet.name}</span>
                <img src={wallet.icon} className="h-8 w-8" />
              </Button>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center font-semibold py-0">
        <div className="fixed w-full h-[2px] bg-black mb-8 left-0 right-0" />
        {!isOpen && (
          <span
            className="flex gap-2 items-center cursor-pointer mt-8"
            onClick={() => setIsOpen(true)}
          >
            {t('show')}
            <FaArrowDown />
          </span>
        )}
        {isOpen && (
          <span
            className="flex gap-2 items-center cursor-pointer mt-8"
            onClick={() => setIsOpen(false)}
          >
            {t('show.less')}
            <FaArrowUp />
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
