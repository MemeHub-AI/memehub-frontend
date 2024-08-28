import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'
import { UserListType } from '@/api/user/types'
import { useAccountContext } from '@/contexts/account'
import { useRef } from 'react'
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const FollowDesktop = () => {
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
    <Dialog>
      <div
        className="flex items-center justify-start"
        style={{ margin: '0 10px 10px 10px' }}
      >
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            shadow="none"
            onClick={() => setTab(UserListType.Followers)}
            className="!bg-white shadow-none pl-0"
          >
            {/* <span className={isMemex ? 'hidden' : ''}>
              {t('followers')}({followers.total})
            </span> */}
            <span className="space-x-1 text-base">
              <span className="font-bold">{followers.total}</span>
              <span className="text-blue-deep">{t('followers')}</span>
            </span>
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTab(UserListType.Following)}
            shadow="none"
            className="!bg-white shadow-none"
          >
            {/* <span className={isMemex ? 'hidden' : ''}>
              {t('following')}({following.total})
            </span> */}
            <span className="space-x-1 text-base">
              <span className="font-bold ">{following.total}</span>
              <span className="text-blue-deep">{t('following')}</span>
            </span>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="p-4">
        <VisuallyHidden>
          <DialogClose ref={closeRef} />
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle>
            {isFollowers
              ? !isOtherUser
                ? t('followers.my')
                : t('followers')
              : !isOtherUser
              ? t('following.my')
              : t('following')}
          </DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}

export default FollowDesktop
