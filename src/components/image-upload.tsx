import React, { type ComponentProps } from 'react'

import { Input } from './ui/input'

export const ImageUpload = (props: ComponentProps<'input'>) => {
  const { children, ...restProps } = props

  return <Input {...restProps} type="file" accept="image/*" />
}

export default ImageUpload
