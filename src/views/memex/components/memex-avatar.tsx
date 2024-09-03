import { isEmpty } from 'lodash'
import { useRef, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'

import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { ApiResponse } from '@/api/types'
import { UserInfoRes, UserUpdateReq } from '@/api/user/types'
import ImageUpload from '@/components/image-upload'
import { Avatar } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useResponsive } from '@/hooks/use-responsive'
import { useUploadImage } from '@/hooks/use-upload-image'
import { cn } from '@/lib/utils'

export const MemexAvatar = ({
  userInfo,
  isOtherUser,
  update,
  refetchUserInfo,
}: {
  userInfo: UserInfoRes | undefined
  isOtherUser: boolean
  update: UseMutateAsyncFunction<
    ApiResponse<UserInfoRes>,
    Error,
    UserUpdateReq,
    string | number
  >
  refetchUserInfo: VoidFunction
}) => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { onChangeUpload, clearFile } = useUploadImage({
    inputEl: inputRef.current,
    onSuccess: (url) => update({ logo: url }).then(() => refetchUserInfo()),
  })
  const { isPad } = useResponsive()

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        contentProps={{ className: 'max-w-[40vw]' }}
      >
        <img
          src={userInfo?.logo}
          alt="avatar"
          className="w-full h-full object-fill"
        />
      </Dialog>

      <Label
        htmlFor="avatar-edit"
        className={cn(
          !isPad &&
            "relative group after:content-[''] after:absolute after:inset-0 cursor-pointer",
          !isOtherUser &&
            !isPad &&
            'after:rounded-full hover:after:bg-black/50 after:transition-all after:bottom-10 after:-top-10'
        )}
        onClick={() => {
          clearFile()
          if (isOtherUser && !isEmpty(userInfo?.logo)) {
            setOpen(true)
          }
        }}
      >
        <Avatar
          src={userInfo?.logo || ''}
          fallback={userInfo?.wallet_address.slice(-4)}
          size={128}
          className="border-4 border-zinc-100 bg-gray-50 bottom-10"
        />
        {!isOtherUser && (
          <>
            <AiOutlineEdit
              size={26}
              className={cn(
                'absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-3/4',
                'z-50 opacity-0 group-hover:opacity-100 transition-all text-white'
              )}
            />
            <ImageUpload
              id="avatar-edit"
              className="absolute invisible"
              ref={inputRef}
              onChange={onChangeUpload}
            />
          </>
        )}
      </Label>
    </div>
  )
}

export default MemexAvatar
