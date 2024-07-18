import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FaTwitter } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { useTranslation } from 'react-i18next';

interface props {
    type:number
}

export const TokenBlock = ({type}: props)=>{
    const {t} = useTranslation()
    return <div className=' border border-solid border-gray-400 rounded-md mt-2 lg:w-[500px]'>
    <div className='relative'>
        <Image className='absolute m-2' src="/favicon.ico" alt="" width={38} height={38}></Image>
        <div className='ml-14 pt-1'>
            <div><span className='text-gray-500'>{t('codeName')} : </span> HEYI</div>
            <div><span className='text-gray-500'>{t('fullName')} : </span> Binance HeYi</div>
        </div>
    </div>
    <div className='flex px-2 my-2 max-lg:justify-between items-center'>
        <div className='flex text-2xl gap-2'>
            <FaTwitter />
            <FaTelegramPlane />
            {true && <TbWorld />}
        </div>
        {type === 1 &&<Button className='border border-solid border-gray-500 p-1 rounded-md lg:ml-9 sm:mr-2 mr-1'>{t('go.trade')}</Button>}
    </div>
    <Progress value={60} className='text-black h-4 w-[96%] ml-2 rounded-sm my-2' indicatorClass="bg-[#97f6fb]">60%</Progress>
</div>
}