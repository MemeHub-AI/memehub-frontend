import { type ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

export const linkStyle = (...cls: ClassValue[]) =>
  cn(
    'transition-all cursor-pointer sm:hover:underline active:underline',
    ...cls
  )
