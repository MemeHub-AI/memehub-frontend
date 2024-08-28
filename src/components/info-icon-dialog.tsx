import { ReactNode } from 'react'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

interface Props {
  children: ReactNode
  iconClass?: string
}

export const InfoIconDialog = ({ children, iconClass }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="mx-1 self-center">
        <InfoCircledIcon className={iconClass} />
      </DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default InfoIconDialog
