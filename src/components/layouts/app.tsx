import React, { type ComponentProps } from 'react'

import { Header } from '../header'
import { Footer } from '../footer'

export const AppLayout = ({ children }: ComponentProps<'div'>) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default AppLayout
