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
import { useIsMemex } from '@/hooks/use-is-memex'
import { cn } from '@/lib/utils'

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
  const { isMemex } = useIsMemex()

  return (
    <Dialog>
      <div
        className={cn(
          'flex items-center justify-between',
          isMemex && 'justify-start'
        )}
        style={isMemex ? { margin: '0' } : { margin: '0 10px 10px 10px' }}
      >
        <DialogTrigger asChild>
          <Button
            variant={isMemex ? 'secondary' : 'outline'}
            size="sm"
            shadow={isMemex ? 'none' : 'default'}
            onClick={() => setTab(UserListType.Followers)}
            className={isMemex ? '!bg-white shadow-none pl-0' : ''}
          >
            <span className={isMemex ? 'hidden' : ''}>
              {t('followers')}({followers.total})
            </span>
            <span className={isMemex ? 'space-x-1 text-base' : 'hidden'}>
              <span className="font-bold ">{followers.total}</span>
              <span className="text-blue-deep ">{t('followers')}</span>
            </span>
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant={isMemex ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setTab(UserListType.Following)}
            shadow={isMemex ? 'none' : 'default'}
            className={isMemex ? '!bg-white shadow-none' : ''}
          >
            <span className={isMemex ? 'hidden' : ''}>
              {t('following')}({following.total})
            </span>
            <span className={isMemex ? 'space-x-1 text-base' : 'hidden'}>
              <span className="font-bold ">{following.total}</span>
              <span className="text-blue-deep ">{t('following')}</span>
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
