import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { BiComment } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { FaBoltLightning } from "react-icons/fa6";
import Header from './header';
const MyPost = () => {
  const imgs = ['/favicon.ico', '/images/ai.jpg']
  const [commenting, setCommenting] = useState(false)
  function stopCommenting() {
    setCommenting(false)
  }
  return (
    <div>
      <div className={cn('flex flex-col')}>
        {/* <Header></Header> */}
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
            <span className="text-sm font-medium text-green-500 lg:ml-[155px]">
              20H:20M
            </span>
          </div>
        </div>
        <div className='ml-16 flex gap-2 '>
          <button className='border border-solid border-black px-2 rounded-md'>编辑</button>
          <button className=' bg-yellow-200 w-24 rounded-md h-8 flex items-center justify-center border border-solid border-black gap-1'><PiPencilSimpleLineThin />代币详情</button>
        </div>
        <div className="ml-16 relative border border-solid border-yellow-600 text-yellow-500 rounded-md py-1 my-2 lg:w-[400px]">
          <FaBoltLightning className='m-1 absolute text-yellow-600 ' />
          <span className='absolute right-0 mr-1 text-green-400'>59m:23s</span>
          <div className='pl-6'>已收集到100个赞</div>
          <div className='pl-6'>请立刻补充代币详情以发射内盘</div>
          <div className='pl-6'>否则创意将失败</div>
        </div>
        <div className="pl-16">
          <p className="text-base width-auto font-medium text-black flex-shrink lg:w-[500px]" >
            Day 07 of the challenge
            I was wondering what I can do with , so just started building
            Twitter UI using Tailwind and so far it looks so promising. I will post my code after completion.
            [07/100]
          </p>
          <div className="md:flex-shrink pr-6 pt-3">
            <div className={cn(imgs.length > 1 && 'grid grid-cols-2 shrink-0', 'md:flex-shrink rounded-md overflow-hidden border lg:w-[500px]')}>
              {imgs.map((image, index) => (
                <div className='shrink-0'>
                  <Image src={image} alt={`Image ${index + 1}`} className="w-full object-cover  h-full" width={100} height={100} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center py-4 justify-between lg:w-[500px]">
            <div className='flex gap-7'>
              <div className=" flex items-center gap-2 text-lg text-gray-500 transition duration-350 ease-in-out">
                <Dialog>
                  <DialogTrigger className='flex items-center gap-2'>
                    <FcLikePlaceholder className='cursor-pointer' />
                    <span className='cursor-pointer'>10</span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader >
                      <DialogTitle className='m-auto'>是否确定后给这条idea点赞</DialogTitle>
                      <DialogDescription className='flex items-center flex-col'>
                        <Image src="/favicon.ico" alt="" width={100} height={100} className='my-4'></Image>
                        <div className='mb-4'>1 <FcLike className='w-8 h-8 inline-block' /> = 0.009 BNB(5 USDT)</div>
                        <div>点赞后如果共识成功，你将获得0.1%代币</div>
                        <div>如果48h后共识失败，你将获得退款</div>
                        <div className='mt-2'>
                          <button className='mx-4 bg-yellow-200 w-18 h-8 rounded-md'>确定</button>
                          <DialogClose>
                            <button className='mx-4 w-18 h-8 rounded-md'>取消</button>
                          </DialogClose>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <div className=" flex items-center gap-2 text-lg text-gray-500  transition duration-350 ease-in-out">
                <Dialog>
                  <DialogTrigger className='flex items-center gap-2'>
                    <BiComment className=' cursor-pointer' />
                    <span className=' cursor-pointer'>14</span>
                  </DialogTrigger>
                  <DialogContent className='w-[320px]'>
                    <DialogHeader >
                      <DialogTitle className='m-auto'>评论</DialogTitle>
                      <DialogDescription className='flex items-center flex-col'>
                        <textarea
                          rows={4}
                          className='border transition ease-in-out w-52 sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500'
                        />
                        <div className='mt-2'>
                          <button className='mx-4 bg-yellow-200 w-18 h-8 rounded-md'>评论</button>
                          <DialogClose>
                            <button className='mx-4 w-18 h-8 rounded-md'>取消</button>
                          </DialogClose>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <div className=" flex items-center gap-1 text-lg text-gray-600 transition duration-350 ease-in-out">
                <BiComment className=' cursor-pointer' />
                <span className=' cursor-pointer mr-3'>Blast</span>
              </div>
            </div>
          </div>

          <div className="  h-4 relative lg:w-[500px] rounded-sm overflow-hidden  bg-gray-200">
            <div className=" w-full h-full z-10 absolute text-center text-[12px] leading-4">
              51%
            </div>
            <div className=" h-full bg-red-500 absolute " style={{ width: '60%' }}></div>
          </div>
        </div>
        <div className=' my-3 bg-gray-400 h-[0.7px] lg:w-[600px] pl-[-5px] mr-[-1.5rem] ml-[-1.5rem]'></div>
      </div>
    </div>
  )
}

export default MyPost