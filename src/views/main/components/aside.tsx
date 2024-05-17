import React from 'react'
import { useTranslation } from 'react-i18next'

const cards = [
  {
    logo: 'https://picsum.photos/id/1015/150/150',
    content:
      'Trump expressed support for cryptocurrency, leading to a surge in popularity for Trump-themed MEME coins.',
  },
  {
    logo: 'https://picsum.photos/id/1015/150/150',
    content: 'OpenAI公司推出GPT-40， AI概念MEME大火',
  },
  {
    logo: 'https://picsum.photos/id/1015/150/150',
    content: 'GME股票大涨，带动相关 MEME币大涨',
  },
  {
    logo: 'https://picsum.photos/id/1015/150/150',
    content: 'Blast发币，MEME币掀起新的狂潮',
  },
  {
    logo: 'https://picsum.photos/id/1015/150/150',
    content: '猫咪类MEME大火',
  },
]

export const HotNewsAside = () => {
  const { t } = useTranslation()

  return (
    <aside className="w-aside">
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
      <img src={c.logo} alt="logo" className="w-28 h-20 object-fill rounded" />
      <p className="font-bold text-sm flex-1">{c.content}</p>
    </div>
  )
}

export default HotNewsAside
