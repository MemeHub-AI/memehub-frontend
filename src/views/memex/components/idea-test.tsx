import { Countdown } from '@/components/countdown'
import GridImages from '@/components/grid-images'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import IdeaCardLikeComment from './idea-card/like-comment'
import IdeaProgress from './idea-progress'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import EllipsisText from '@/components/ellipsis-text'
import TokenDetailsCard from './token-detail-card'
import IdeaHeartButton from './idea-heart-button'
import { GoComment } from 'react-icons/go'
import { PiShareFat } from 'react-icons/pi'
import { Card } from '@/components/ui/card'
import SocialLinks from '@/components/social-links'

const IdeaTest = () => {
  return (
    <div>
      <Data2 />
      <Data1 />
    </div>
  )
}

const Data1 = () => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex px-3 py-3 relative border-b-2')}>
      <Avatar
        src={
          //   'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/微信图片_20240708182621dec3444f87d89b0d39c8b8b3fa9dd4ff7a62f599d590382d6b70730d8b53c899.jpg'
          'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/17153125260585ed252d3476dfa6c3816cf7d0e72c00d.png'
        }
        className="rounded-md mr-2"
      />
      <div className="flex-1">
        <div className="space-x-1 text-zinc-500 text-sm leading-none max-w-[70%] inline-flex items-center">
          <span className="font-bold text-base text-black truncate hover:underline">
            rich
          </span>
          <span>·</span>
          <span className="shrink-0">12 minutes ago</span>
        </div>

        <div className="flex flex-col items-start">
          <Countdown
            className="text-sm text-green-700"
            createdAt={0}
            duration={3}
          />
        </div>

        <EllipsisText
          className="mt-1"
          showMoreClass="text-purple-600"
          maxLine={5}
          disableClickShowMore
        >
          The Crypto Revolution! A digital asset that's taking the world by
          storm. Invest now and be part of the future! Or, Musk's Meme Coin -
          The ultimate crypto craze! Don't miss out on this golden opportunity.
          Another one could be: Musk's Meme Coin - Leading the crypto charge.
          Seize the moment and grow your wealth.
        </EllipsisText>

        <Card
          shadow="none"
          padding="sm"
          className={cn('border-zinc-300 border rounded relative')}
        >
          <div className="flex space-x-2">
            <Avatar
              src={
                'https://pbs.twimg.com/profile_images/1815749056821346304/jS8I28PL_400x400.jpg'
              }
            />
            <div className="text-zinc-500 text-sm flex flex-col justify-between">
              <p>
                {t('memex.symbol')}: <span className="text-black">ERM</span>
              </p>
              <p>
                {t('name')}: <span className="text-black">Elon Reeve Musk</span>
              </p>
            </div>
          </div>

          <div className={cn('flex justify-between items-center')}>
            <SocialLinks
              className={'mt-0'}
              buttonProps={{ size: 'icon-sm' }}
              x={'tt'}
            />
          </div>
        </Card>

        <GridImages
          urls={[
            'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/171531252605819e22e97ea9382cfe910472b656a0cef.png',
          ]}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3 select-none">
            <div
              className="flex items-center space-x-1 text-sm cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <IdeaHeartButton
                likedCount={'8'}
                isLiked={true}
                onClick={() => 111}
              />
            </div>
            <div className="flex items-center space-x-1 text-sm cursor-pointer">
              <GoComment className="w-5 h-5" />
              <span>8</span>
            </div>

            <button>
              <PiShareFat size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <img
              src={'https://storage.memehub.ai/chains/logo/bsc.png'}
              alt="chain"
              className="w-5 h-5"
            />
            <span>BNB Chain</span>
          </div>
        </div>
        <IdeaProgress value={80} className="!h-5" />
      </div>
    </div>
  )
}

const Data2 = () => {
  const { t } = useTranslation()

  return (
    <div className={cn('flex px-3 py-3 relative border-b-2')}>
      <Avatar
        src={
          'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/微信图片_20240708182621dec3444f87d89b0d39c8b8b3fa9dd4ff7a62f599d590382d6b70730d8b53c899.jpg'
          //   'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/uploads/17153125260585ed252d3476dfa6c3816cf7d0e72c00d.png'
        }
        className="rounded-md mr-2"
      />
      <div className="flex-1">
        <div className="space-x-1 text-zinc-500 text-sm leading-none max-w-[70%] inline-flex items-center">
          <span className="font-bold text-base text-black truncate hover:underline">
            7ea0
          </span>
          <span>·</span>
          <span className="shrink-0">10 minutes ago</span>
        </div>

        {/* <div className="flex flex-col items-start">
          <Countdown
            className="text-sm text-green-700"
            createdAt={0}
            duration={3}
          />
        </div> */}

        <EllipsisText
          className="mt-1 break-normal"
          showMoreClass="text-purple-600"
          maxLine={5}
          disableClickShowMore
        >
          I found Harris to be a walking meme, and she's likely to be the next
          president, bro, go for it!
        </EllipsisText>

        {/* {hasDetails && (
            <TokenDetailsCard
              className="mt-1"
              details={restIdea as NonNullable<keyof typeof restIdea>}
              tokenAddr={tokenAddr}
            />
          )} */}

        <Card
          shadow="none"
          padding="sm"
          className={cn('border-zinc-300 border rounded relative')}
        >
          <div className="flex space-x-2">
            <Avatar
              src={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMbKp6WUZVFBn5el-_JRGC3_A7jlFquxvCIuAIfp4SAUtSH2AV8ete3q2NGpH0mpa4EEs&usqp=CAU'
              }
            />
            <div className="text-zinc-500 text-sm flex flex-col justify-between">
              <p>
                {t('memex.symbol')}: <span className="text-black">AH</span>
              </p>
              <p>
                {t('name')}: <span className="text-black">Abstract Harris</span>
              </p>
            </div>
          </div>

          <div className={cn('flex justify-between items-center')}>
            <SocialLinks
              className={'mt-0'}
              buttonProps={{ size: 'icon-sm' }}
              x={'tt'}
              tg={'tt'!}
              website={'tt'}
            />
          </div>
        </Card>

        <GridImages
          urls={[
            'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQuLUmTtQNSjFz6wnRb2QrJu5Bz7l_xqhY-EWsOnroCM2CEbGpngRcosMObC9ouoZ68j91u4sxPTpLjh2g',
            'data:image/jpeg;base64,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',
            'data:image/jpeg;base64,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',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz-gx7UZppIT1kvPMKOI-Ibx8vc2QacBTScw&s',
          ]}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3 select-none">
            <div
              className="flex items-center space-x-1 text-sm cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <IdeaHeartButton
                likedCount={'80'}
                isLiked={true}
                onClick={() => 111}
              />
            </div>
            <div className="flex items-center space-x-1 text-sm cursor-pointer">
              <GoComment className="w-5 h-5" />
              <span>30</span>
            </div>

            <button>
              <PiShareFat size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <img
              src={'https://storage.memehub.ai/chains/logo/bsc.png'}
              alt="chain"
              className="w-5 h-5"
            />
            <span>BNB Chain</span>
          </div>
        </div>
        <IdeaProgress value={80} className="!h-5" />
      </div>
    </div>
  )
}
export default IdeaTest
