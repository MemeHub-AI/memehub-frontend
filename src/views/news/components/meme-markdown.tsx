import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { cn } from '@/lib/utils'
import clsx from 'clsx'

const excludeIds = ['search-interest']

const excludeClass = ['google-trends-iframe']

const Loading = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <p
      className={clsx(
        'absolute inset-0 w-100 h-72 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex justify-center items-center bg-zinc-200 animate-pulse rounded-md',
        className
      )}
    >
      {t('loading')}
    </p>
  )
}

export const MemeMarkdown = ({
  children,
  ...props
}: ComponentProps<typeof ReactMarkdown>) => {
  const { t } = useTranslation()

  const renderYoutubeVideo = (
    source: string,
    props: ComponentProps<'embed'>
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const src = source.replace('/v/', '/embed/')
    const splited = src.split('&')

    return (
      <div
        className={cn('min-w-100 min-h-72 relative rounded overflow-hidden')}
      >
        {isLoading && <Loading />}
        <iframe
          className={cn('w-full h-full', props.className)}
          src={splited[0]}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    )
  }

  return (
    <ReactMarkdown
      children={children}
      rehypePlugins={[rehypeRaw]}
      components={{
        object: ({ className, ...props }) => {
          return (
            <object
              className={cn('my-4 mx-auto', className)}
              {...props}
            ></object>
          )
        },
        // @ts-ignore
        'lite-youtube': ({ className, ...props }) => {
          const [isLoading, setIsLoading] = useState(true)
          return (
            <div className={cn(className, 'relative mx-auto')}>
              {isLoading && <Loading />}
              <center>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${props.videoid}?${props.params}`}
                  className="min-w-100 min-h-72 rounded-md my-4 max-sm:min-w-full max-sm:w-full"
                  onLoad={() => setIsLoading(false)}
                ></iframe>
              </center>
            </div>
          )
        },
        // @ts-ignore
        'lite-tiktok': ({ className, ...props }) => {
          const [isLoading, setIsLoading] = useState(true)
          return (
            <div className={cn(className, 'relative')}>
              {isLoading && <Loading />}
              <iframe
                // h7134531995161414954
                src={`https://www.tiktok.com/embed/v2/${props.videoid}`}
                className="min-w-[80%] min-h-[600px] rounded-md my-4 max-sm:min-w-full max-sm:w-full"
                onLoad={() => setIsLoading(false)}
              ></iframe>
            </div>
          )
        },
        embed: (props) => {
          const src1 = (props as { 'data-src1'?: string })['data-src1'] ?? ''
          const isYoutube = src1?.includes('youtube.com')

          if (isYoutube) return renderYoutubeVideo(src1, props)
          return <embed {...props}></embed>
        },
        h2: ({ className, ...props }) => {
          if (excludeIds.includes(String(props.id ?? ''))) return
          return <h2 className={cn('text-2xl', className)} {...props}></h2>
        },
        p: ({ className, ...props }) => {
          const isVideo =
            (props.children as Record<string, any>)?.type === 'object'
          return (
            <p
              className={cn(
                'mb-4',
                isVideo && 'flex justify-center items-center',
                className
              )}
              {...props}
            ></p>
          )
        },
        iframe: ({ ...props }) => {
          if (excludeClass.some((s) => props.className?.includes(s))) return
          return <iframe {...props} className="w-full"></iframe>
        },
        a: ({ className, ...props }) => {
          return <a className={cn('text-red-800', className)} {...props}></a>
        },
        hr: ({ className, ...props }) => {
          return <hr className={cn('my-4', className)} {...props} />
        },
        center: ({ className, ...props }) => {
          return <center className={cn('my-4', className)} {...props}></center>
        },
        img: ({ className, ...props }) => {
          return <img className={cn('my-4 rounded', className)} {...props} />
        },
      }}
      {...props}
    />
  )
}

export default MemeMarkdown
