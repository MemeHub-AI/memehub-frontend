import { IoCloseOutline } from 'react-icons/io5'
import { toast } from 'sonner'

export const CloseButton = () => {
  return (
    <div className="absolute z-20 right-0 -top-2">
      <IoCloseOutline
        size={22}
        color="#666666"
        className="cursor-pointer"
        onClick={() => {
          toast.dismiss()
        }}
      ></IoCloseOutline>
    </div>
  )
}
