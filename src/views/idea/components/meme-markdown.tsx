import React, { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { cn } from '@/lib/utils'

const excludeIds = ['search-interest']

const excludeClass = ['google-trends-iframe']

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
      <div className={cn('w-full h-full relative rounded overflow-hidden')}>
        {isLoading && (
          <p className="absolute inset-0 flex justify-center items-center bg-zinc-200 animate-pulse">
            {t('loading')}
          </p>
        )}
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
          return <iframe {...props}></iframe>
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
