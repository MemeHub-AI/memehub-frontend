import { ReactElement, ReactNode, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAccountContext } from '@/contexts/account'
import { UserListType } from '@/api/user/types'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'

export const FollowMoblie = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(UserListType.Following)
  const { isOtherUser, followersResults, followingResults, refetchFollow } =
    useAccountContext()
  const {
    followers,
    isLoading: isLoadingFollowers,
    isFetching: isFetchingFollowers,
  } = followersResults
  const {
    following,
    isLoading: isLoadingFollowing,
    isFetching: isFetchingFollowing,
  } = followingResults
  const closeRef = useRef<HTMLButtonElement>(null)
  const isFollowers = tab === UserListType.Followers

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          shadow="none"
          onClick={() => setTab(UserListType.Followers)}
          className="!bg-white shadow-none pl-0"
        >
          <span className="text-base flex flex-col text-start">
            <span className="font-bold">{followers.total}</span>
            <span className="text-zinc-500 text-sm pl-0">{t('followers')}</span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setTab(UserListType.Following)}
          shadow="none"
          className="!bg-white shadow-none"
        >
          <span className="text-base flex flex-col text-start">
            <span className="font-bold">{following.total}</span>
            <span className="text-zinc-500 text-sm">{t('following')}</span>
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent
        className="p-4 min-h-100 max-h-[80vh] rounded-t-md"
        side={'bottom'}
      >
        <VisuallyHidden>
          <SheetClose ref={closeRef} />
        </VisuallyHidden>
        <SheetHeader>
          <SheetTitle>
            {isFollowers
              ? !isOtherUser
                ? t('followers.my')
                : t('followers')
              : !isOtherUser
              ? t('following.my')
              : t('following')}
          </SheetTitle>
        </SheetHeader>
        {isFollowers ? (
          <FollowersCards
            cards={followers.list}
            total={following.total}
            isLoading={isLoadingFollowers}
            isPending={isFetchingFollowers}
            onCardClick={() => closeRef.current?.click()}
          />
        ) : (
          <FollowingCards
            cards={following.list}
            total={followers.total}
            isLoading={isLoadingFollowing}
            isPending={isFetchingFollowing}
            onCardClick={() => closeRef.current?.click()}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

export default FollowMoblie
