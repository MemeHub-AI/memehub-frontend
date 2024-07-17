import React, { forwardRef, type ComponentProps } from 'react'

import { Input } from './ui/input'

export const ImageUpload = forwardRef<
  HTMLInputElement,
  ComponentProps<'input'>
>((props, ref) => {
  const { children, ...restProps } = props

  return <Input {...restProps} ref={ref} type="file" accept="image/*" />
})

export default ImageUpload
