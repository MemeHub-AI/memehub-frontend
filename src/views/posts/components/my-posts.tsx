import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { InteractiveList } from './ui/interactive-list';
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { FaBoltLightning } from "react-icons/fa6";
import Imgs from './ui/imgs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
interface Props {
    posts: any[]
}
export const MyPosts = ({ posts }: Props) => {
    const { t } = useTranslation()
    const imgs = ['/favicon.ico', '/images/ai.jpg']
    return (
        <div>
            <div className={cn('flex flex-col')}>
                <div className="flex items-center">
                    <div className='shrink-0 mt-2'>
                        <Image className="inline-block h-10 w-10 rounƒded-full" src="/favicon.ico" alt="" width={50} height={50} />
                    </div>
                    <div className="ml-7 flex max-lg:justify-between w-[100%] items-center">
                        <div>
                            <p className="text-base font-medium text-black ">
                                Sonali Hiraveee
                                <span className="text-sm leading-10 font-medium text-gray-500 group-hover:text-gray-300 transition ease-in-out duration-150 pl-3">
                                    20分钟
                                </span>
                            </p>
                        </div>
                        {/* 先判断是否为未补充代币详情状态，如果是的话不显示内容，如果不是就判断是否已经成功上币，如果以上币就显示started*/}
                        {true && (true ?
                            <span className='bg-purple-500 rounded-md p-1 text-white lg:ml-[155px] font-bold'>
                                {t('started')}
                            </span> :
                            <span className="text-sm font-medium text-green-500 lg:ml-[155px]">
                                20H:20M
                            </span>)
                        }
                    </div>
                </div>
                <div className='ml-16 flex gap-2 '>
                    {/* 判断是否已经发射，如果没有发射展示编辑按钮，判断是否是未打满并且没有补全代币详情 */}
                    <button className='border border-solid border-black px-2 rounded-md'>{t('edit')}</button>
                    <Button className=' bg-yellow-200 rounded-md h-8 gap-1'><PiPencilSimpleLineThin />{t('token.detail')}</Button>
                </div>
                {/* 先判断是否为未补充代币详情状态，如果是的话显示已完成筹集尽快补充，如果不是显示尽快补充*/}
                {true && false ?
                    <div className="ml-16 relative border border-solid border-yellow-600 text-yellow-500 rounded-md py-1 my-2 lg:w-[400px]">
                        <FaBoltLightning className='m-1 absolute text-yellow-600 ' />
                        <span className='absolute right-0 mr-1 text-green-400'>59m:23s</span>
                        <div className='pl-6'>{t('hundred.like')}</div>
                        <div className='pl-6'>{t('add.launch')}</div>
                        <div className='pl-6'>{t('idea.fail')}</div>
                    </div>
                    :
                    <div className="ml-16 relative border border-solid border-yellow-600 text-yellow-500 rounded-md py-1 my-2 lg:w-[400px]">
                        <IoAlertCircleOutline className='mx-2 mt-1 absolute text-yellow-600 ' />
                        <div className='pl-7'>{t('add.details')}</div>
                    </div>}

                <div className="pl-16">
                    <p className="text-base width-auto font-medium text-black flex-shrink lg:w-[500px]" >
                        Day 07 of the challenge
                        I was wondering what I can do with , so just started building
                        Twitter UI using Tailwind and so far it looks so promising. I will post my code after completion.
                        [07/100]
                    </p>
                    {/* 判断已发射或者补全信息就可以显示 */}
                    {(true || false) && <div className=' border border-solid border-gray-400 rounded-md mt-2 lg:w-[500px]'>
                        <div className='relative'>
                            <Image className='absolute m-2' src="/favicon.ico" alt="" width={38} height={38}></Image>
                            <div className='ml-14 pt-1'>
                                <div><span className='text-gray-500'>代号：</span>HEYI</div>
                                <div><span className='text-gray-500'>全称：</span>Binance HeYi</div>
                            </div>
                        </div>
                        <div className='flex px-2 my-2 max-lg:justify-between items-center'>
                            <div className='flex text-2xl gap-2'>
                                <FaTwitter />
                                <FaTelegramPlane />
                                {true && <TbWorld />}
                            </div>
                            <Button className='border border-solid border-gray-500 p-1 rounded-md lg:ml-9'>Go To Trade</Button>
                        </div>
                        <div className='mx-2'>
                            <div className="my-2 h-4 relative w-full rounded-sm overflow-hidden  bg-gray-200">
                                <div className=" w-full h-full z-10 absolute text-center text-[12px] leading-4">
                                    61%
                                </div>
                                <div className=" h-full absolute " style={{ width: '60%', backgroundColor: '#97f6fb' }}></div>
                            </div>
                        </div>
                    </div>}
                    <Imgs imgs={imgs} className='mt-3 mr-1' />
                    <InteractiveList className='my-3' />
                    <Progress value={60} className='text-black h-4 lg:w-[500px]' indicatorClass="bg-red-500">60%</Progress>
                </div>
                <div className={cn(' my-3 bg-gray-400 h-[0.7px] mr-[-0.7rem] lg:w-[600px] pl-[-5px]  ml-[-1.5rem] sm:mr-[-1.4rem]' )}></div>
            </div>
        </div>
    )
}