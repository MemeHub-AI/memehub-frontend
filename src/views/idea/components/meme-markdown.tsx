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
                  className="min-w-100 min-h-72 rounded-md my-4 max-sm:min-w-full"
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
                className="min-w-[80%] min-h-[600px] rounded-md my-4 max-sm:min-w-full"
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

//"<section class=\"bodycopy\">\n<h2 id=\"about\">About</h2>\n<p><strong><em>House Of The Dragon</em></strong> is a spin-off TV show created by <a href=\"https://knowyourmeme.com/memes/events/2017-hbo-hack\" class=\"internal-link\">HBO</a> and <a href=\"https://knowyourmeme.com/memes/people/george-rr-martin\" class=\"internal-link\">George R.R. Martin</a> as a spin-off prequel to the show <a href=\"https://knowyourmeme.com/memes/subcultures/game-of-thrones\" class=\"internal-link\"><em>Game of Thrones</em></a>, set 200 years before based on the events of \"The Dance of Dragons\" during the Targaryen civil war in Westeros. Due to the pop culture relevance of the original show and the expectations going into it of both the story and the actors, the show has received significant attention online, as well as <a href=\"/memes/memes\" class=\"auto-link\">memes</a>. Season one premiered in August 2022.</p>\n<div data-s=\"117026\" id=\"primis_player\"/>\n <h2 id=\"history\">History</h2>\n<p>Shortly after the completion of season eight of <em>Game of Thrones</em> in 2019, rumors of a prequel spinoff being made quickly began to circulate. Upon official confirmation that a prequel was in development, a mix of hype and nervousness began to spread in fear of the show being as rushed and poorly executed as <em>Game of Thrones</em> season eight, which notoriously left many fans angry. On October 5th, 2021, the official HBO Max <a href=\"/memes/sites/youtube\" class=\"auto-link\">YouTube</a> channel released the first teaser trailer<sup class=\"footnote\" id=\"fnr1\"><a href=\"#fn1\" class=\"footnote-superscript\">[1]</a></sup> for <em>House of the Dragon</em>, which was viewed over 17 million times in 10 months, as well as give the basic premise of what to expect (shown below).</p>\n<p><br/></p><center><lite-youtube style=\"height: 236px; width: 420px;\" videoid=\"fNwwt25mheo\"/></center><br/>\n<p>On August 21st, 2022, the show had its first episode, titled \"The Heirs of the Dragon,\" released on HBO Max, drawing nearly 10 million viewers as it became HBO's most-watched premiere in history.<sup class=\"footnote\" id=\"fnr4\"><a href=\"#fn4\" class=\"footnote-superscript\">[4]</a></sup></p>\n<p><br/></p><center><lite-youtube style=\"height: 236px; width: 420px;\" videoid=\"YB5WFSQUOx0\"/></center><br/>\n<div class=\"ad-unit-wrapper\">\n<div class=\"ad-unit-label\"/>\n<div class=\"incontent-leaderboard-unit-wrapper\">\n<div class=\"shemedia-ad\" data-lazy=\"\" data-shemedia-size=\"wideincontent\" id=\"kym-desktop-entry-incontent-leaderboard-1\"/>\n</div>\n</div>\n <h2 id=\"reception\">Reception</h2>\n<p>Following the release of the first episode of the series on August 21st, 2022, the show was largely well received by the community and critics alike. On IMDb,<sup class=\"footnote\" id=\"fnr5\"><a href=\"#fn5\" class=\"footnote-superscript\">[5]</a></sup> <em>HotD</em> received a 9 out of 10 rating, while on Rotten Tomatoes,<sup class=\"footnote\" id=\"fnr6\"><a href=\"#fn6\" class=\"footnote-superscript\">[6]</a></sup> it received an 82 percent critic score and an 87 percent audience score.</p>\n<h2 id=\"online-reactions\">Online Reactions</h2>\n<p><em>House of the Dragon</em> began seeing reactions, memes and other social media posts from people online almost immediately upon release of episode one. For example, late on the night of August 21st, 2022, TikToker BrettyBuckets<sup class=\"footnote\" id=\"fnr2\"><a href=\"#fn2\" class=\"footnote-superscript\">[2]</a></sup> uploaded a video of an apartment building in which it could be seen that several of the apartments were watching the show at the same time, with their lights changing based on when in the intro they were, earning over 890,000 likes and featuring several comments talking about the show favorably (shown below). The <a href=\"/memes/viral-videos\" class=\"auto-link\">viral video</a> was also reposted by numerous users elsewhere online.</p>\n<p><br/></p><center><lite-tiktok videoid=\"7134531995161414954\"><blockquote class=\"tiktok-embed\" data-video-id=\"7134531995161414954\"><section><a href=\"https://www.tiktok.com/embed/v2/7134531995161414954\">https://www.tiktok.com/embed/v2/7134531995161414954</a></section></blockquote></lite-tiktok></center><br/>\n<p>Due to one of the main characters (Daemon Targaryen) being acted by Matt Smith, who also starred in <a href=\"https://knowyourmeme.com/memes/subcultures/morbius-2022-film\" class=\"internal-link\"><em>Morbius</em></a> months before <em>HotD</em>, many early memes from the show revolved around references to his character Milo in <em>Morbius</em>, as can be seen in the post by <a href=\"/memes/sites/reddit\" class=\"auto-link\">Redditor</a> Avaenem<sup class=\"footnote\" id=\"fnr3\"><a href=\"#fn3\" class=\"footnote-superscript\">[3]</a></sup> on August 22nd, 2022, in which the <a href=\"https://knowyourmeme.com/memes/its-morbin-time\" class=\"internal-link\">Morbin Time</a> <a href=\"/memes/catchphrases\" class=\"auto-link\">catchphrase</a> is used for Daemon alongside the <a href=\"https://knowyourmeme.com/memes/milos-dance-have-sex\" class=\"internal-link\">Milo Dance</a> meme, earning over 1,700 upvotes in one day on /r/freefolk (shown below)</p>\n<center><iframe id=\"reddit-embed\" sandbox=\"allow-scripts allow-same-origin allow-popups\" style=\"border: none;\" height=\"476\" width=\"640\" scrolling=\"no\" loading=\"lazy\" class=\"lazy-iframe\" data-src=\"https://www.redditmedia.com/r/freefolk/comments/wut9ok/its_daemonin_time/?ref_source=embed&amp;ref=share&amp;embed=true\"/></center><p><br/></p>\n<h2 id=\"search-interest\">Search Interest</h2>\n<iframe class=\"google-trends-iframe lazy-iframe\" loading=\"lazy\" data-src=\"https://trends.google.com/trends/embed/explore/TIMESERIES?eq=date%3Dall&amp;geo=&amp;q=Game+of+Thrones+House+of+the+Dragon&amp;req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22Game+of+Thrones+House+of+the+Dragon%22%2C%22geo%22%3A%22%22%2C%22time%22%3A%22all%22%7D%5D%2C%22category%22%3A0%2C%22property%22%3A%22%22%7D&amp;tz=0\"/>\n<h2 id=\"external-references\">External References</h2>\n<div class=\"references\">\n<p id=\"fn1\"><sup class=\"footnote\"><a href=\"#fnr1\">[1]</a></sup> <span class=\"footnote-text\">YouTube – <a href=\"https://www.youtube.com/watch?v=fNwwt25mheo\" target=\"_blank\" class=\" external-link\">House of Dragons Teaser</a></span></p>\n<p id=\"fn2\"><sup class=\"footnote\"><a href=\"#fnr2\">[2]</a></sup> <span class=\"footnote-text\">Tiktok – <a href=\"https://www.tiktok.com/@brettybuckets/video/7134531995161414954\" target=\"_blank\" class=\" external-link\">Apartments</a></span></p>\n<p id=\"fn3\"><sup class=\"footnote\"><a href=\"#fnr3\">[3]</a></sup> <span class=\"footnote-text\">Reddit – <a href=\"https://www.reddit.com/r/freefolk/comments/wut9ok/its_daemonin_time/\" target=\"_blank\" class=\" external-link\">Daemon</a></span></p>\n<p id=\"fn4\"><sup class=\"footnote\"><a href=\"#fnr4\">[4]</a></sup> <span class=\"footnote-text\">NPR – <a href=\"https://www.npr.org/2022/08/23/1118956545/house-of-the-dragon-game-of-thrones-hbo-max\" target=\"_blank\" class=\" external-link\">Most Watched Premiere in HBO History</a></span></p>\n<p id=\"fn5\"><sup class=\"footnote\"><a href=\"#fnr5\">[5]</a></sup> <span class=\"footnote-text\">IMDb – <a href=\"https://www.imdb.com/title/tt11198330/\" target=\"_blank\" class=\" external-link\">HotD Rating</a></span></p>\n<p id=\"fn6\"><sup class=\"footnote\"><a href=\"#fnr6\">[6]</a></sup> <span class=\"footnote-text\">Rotten Tomatoes – <a href=\"https://www.rottentomatoes.com/tv/house_of_the_dragon\" target=\"_blank\" class=\" external-link\">HotD Rating</a><br/>\n</span></p>\n</div>\n</section>\n\n",
