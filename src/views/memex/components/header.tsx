import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Posts } from '../type'
import { Tabs } from '@/components/ui/tabs'

interface HeaderProps {
  setPosts: React.Dispatch<React.SetStateAction<Posts | undefined>>
}

const Header = ({ setPosts }: HeaderProps) => {
  // enum postTabs {
  //   latest,
  //   hot,
  //   myIdea,
  //   myParticipate,
  // }
  const { t } = useTranslation()
  // useEffect(()=>{
  //   setPosts(ortherPosts)
  // })
  const ortherPosts: Posts = {
    type: 1,
    data: [
      {
        isLaunched: true,
        isAirdrop: true,
      },
      {
        isLaunched: true,
        isAirdrop: false,
      },
      {
        isLaunched: false,
        isAirdrop: false,
      },
    ],
  }
  const myPosts: Posts = {
    type: 0,
    data: [
      {
        isLaunched: true,
        isDetailed: true,
      },
      {
        isLaunched: true,
        isDetailed: false,
      },
      {
        isLaunched: false,
        isDetailed: false,
      },
      {
        isLaunched: false,
        isDetailed: false,
      },
    ],
  }
  const [selected, setSelected] = useState(0)
  const tabs = [t('latest'), t('hot'), t('idea'), t('my.participate')]

  function onChangeTab(i: number, e: React.MouseEvent) {
    const target = e.target as HTMLElement
    setSelected(i)
    if (target.innerText === t('latest') || target.innerText === t('hot')) {
      setPosts(ortherPosts)
    }
    if (target.innerText === t('idea')) {
      setPosts(myPosts)
    }
  }

  return (
    <div
      className={cn(
        'flex h-10 border-solid border-black border-b-2 mr-[-0.78rem] ml-[-1.5rem] md:mr-[-1.48rem]'
      )}
    >
      {tabs.map((t, i) => {
        return (
          <Tabs className="relative ml-3">
            <span
              className={cn(
                'text-lg leading-[35px] pl-3 cursor-pointer',
                i === selected &&
                  cn(
                    'after:absolute after:w-8 after:left-1/2 after:-translate-x-[calc(50%-6px)] after:bottom-0 after:h-0.5 after:bg-purple-500'
                  )
              )}
              onClick={(e) => {
                onChangeTab(i, e)
              }}
            >
              {t}
            </span>
          </Tabs>
        )
      })}
    </div>
  )
}

export default Header
