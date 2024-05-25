import React from 'react'
import { useTranslation } from 'react-i18next'

const cards = [
  {
    logo: '/images/trump.jpeg',
    content: '特朗普表示支持加密货币，Trump概念MEME币大火。',
  },
  {
    logo: '/images/ai.jpg',
    content: 'OpenAI公司推出GPT-4o， AI概念MEME大火',
  },
  {
    logo: '/images/gamestop.avif',
    content: 'GME股票大涨，带动相关 MEME币大涨',
  },
  {
    logo: '/images/cat.jpg',
    content: '猫咪类MEME大火',
  },
]

export const HotNewsAside = () => {
  const { t } = useTranslation()

  return (
    <aside className="w-aside max-sm:hidden">
      <h2 className="text-red-500 text-xl font-bold mb-4">
        {t('hot-opportunity')}
      </h2>
      <div className="flex flex-col gap-3">
        {cards.map((c, i) => (
          <NewsCard c={c} key={i} />
        ))}
      </div>
    </aside>
  )
}

const NewsCard = ({ c }: { c: (typeof cards)[number] }) => {
  return (
    <div className="flex gap-2 hover:text-blue-600 transition-all cursor-pointer">
      <img src={c.logo} alt="logo" className="w-32 h-20 object-fill rounded" />
      <p className="font-bold text-sm flex-1">{c.content}</p>
    </div>
  )
}

export default HotNewsAside
