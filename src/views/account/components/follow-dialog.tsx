import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
import { useAccountContext } from '@/contexts/account'
import { UserListType } from '@/api/user/types'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'

export const FollowDialog = ({
  tab,
  setTab,
}: {
  tab: UserListType
  setTab: (tab: UserListType) => void
}) => {
  const { t } = useTranslation()
  const closeRef = useRef<HTMLButtonElement>(null)
  const { followersResults, followingResults } = useAccountContext()
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
  const isFollowers = tab === UserListType.Followers

  return (
    <Dialog>
      <div
        className="flex items-center justify-between"
        style={{ margin: '0 10px 10px 10px' }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTab(UserListType.Followers)}
          >
            {t('followers')}({followers.total})
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTab(UserListType.Following)}
          >
            {t('following')}({following.total})
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="p-4">
        <VisuallyHidden>
          <DialogClose ref={closeRef} />
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle>
            {isFollowers ? t('followers.my') : t('following.my')}
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

export default FollowDialog
