import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { Routes } from '@/routes'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="min-h-footer flex items-center justify-center">
      {t('copyright')} © {new Date().getFullYear()}
      <Link
        href="https://github.com/MemeHub-AI"
        target="_blank"
        className="text-blue-600 mx-1 cursor-pointer hover:underline"
      >
        {t('meme-hub')}
      </Link>
      {t('copyright.reserved')}
    </footer>
  )
}

export default Footer
