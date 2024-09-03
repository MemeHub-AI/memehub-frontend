import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export const DialogHowWork = ({ isCollapsed }: { isCollapsed?: boolean }) => {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={cn(
            'border border-zinc-200 p-2 flex items-start space-x-2 hover:bg-zinc-100 cursor-pointer rounded-sm',
            isCollapsed && 'p-0 border-none'
          )}
        >
          <img
            src="/images/nav-introduce.jpg"
            className={cn('w-12 h-12 rounded-sm', isCollapsed && 'w-10 h-10')}
          />
          <div className={cn('text-start', isCollapsed && 'hidden')}>
            <p className="font-semibold text-base">{t('how.to.work')}</p>
            <p className="text-sm">Memehub = Crypto X</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t('how.to.work')}</DialogTitle>
          <DialogDescription>
            <div>
              <p>{t('how.work.1')}</p>
              <br />
              <p>{t('how.work.2')}</p>
              <br />
              <p>{t('how.work.3')}</p>
              <br />
              <p>{t('how.work.4')}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DialogHowWork
