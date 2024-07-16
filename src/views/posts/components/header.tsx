import { t } from 'i18next'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

const Header = () => {
    const [selected , setSelected] = useState(0);
    const tabs = [t('latest'), t('hot'), t('idea') , t('participate')]
    function onChangeTab(i:number){
        setSelected(i)
    }
  return (
    <div className={cn('flex h-10 border-solid border-black border-b-2 mr-[-1.5rem] ml-[-1.5rem] ')}>
        {tabs.map((t , i)=>{
            return <div className='relative'>
                <span className={cn('text-lg leading-[35px] px-3 cursor-pointer' , i===selected&&'after:absolute after:w-8 after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-0.5 after:bg-purple-500')} onClick={()=>{
                onChangeTab(i)
            }}>{t}</span>
            </div>
        })}
    </div>
  )
}

export default Header