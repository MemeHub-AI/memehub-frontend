import { useTradeToastContext } from '@/contexts/trade-toast'
import { toast } from 'sonner'
import { IoCloseOutline } from 'react-icons/io5'

export const CloseButton = () => {
  const { getToastId } = useTradeToastContext()

  return (
    <IoCloseOutline
      size={22}
      className="absolute z-20 -right-2 -top-2 cursor-pointer text-zinc-500 hover:text-black"
      onClick={() => toast.dismiss(getToastId())}
    />
  )
}
