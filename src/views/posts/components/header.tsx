import { t } from 'i18next'
import React, { Dispatch, useState } from 'react'
import { cn } from '@/lib/utils'
interface HeaderProps {
    setPosts: React.Dispatch<React.SetStateAction<any[]>>
  }

const Header = ({setPosts}:HeaderProps) => {
    const [selected , setSelected] = useState(0);
    const tabs = [t('latest'), t('hot'), t('idea') , t('participate')]
    function onChangeTab(i:number , e:React.MouseEvent){
        const target = e.target as HTMLElement
        setSelected(i)
        setPosts([target.innerText])
    }
  return (
    <div className={cn('flex h-10 border-solid border-black border-b-2 mr-[-0.68rem] ml-[-1.5rem] md:mr-[-1.46rem]')}>
        {tabs.map((t , i)=>{
            return <div className='relative' >
                <span className={cn('text-lg leading-[35px] px-3 cursor-pointer' , i===selected&&'after:absolute after:w-8 after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-purple-500')} onClick={(e)=>{
                onChangeTab(i , e)
            }}>{t}</span>
            </div>
        })}
    </div>
  )
}

export default Header