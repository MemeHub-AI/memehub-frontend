import { Routes } from '@/routes'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const useGenAIIdea = () => {
  const [show, setShow] = useState(false)
  const [isRandom, setRandom] = useState(false)
  const [value, setValue] = useState('')
  const { pathname, push } = useRouter()

  const { setLoading, setInfo } = useAimemeInfoStore()

  const onInputGen = (value: string) => {
    setShow(true)
    setRandom(false)
    setValue(value)
  }

  const onRandomGen = () => {
    setShow(true)
    setRandom(true)
  }

  const onConfirm = () => {
    setShow(false)
    setRandom(false)
    setInfo({ name: value })
    setLoading(true)

    if (!pathname.startsWith(Routes.Create)) {
      push(Routes.Create)
    }
  }

  const onCancel = () => {
    setShow(false)
    setRandom(false)
  }

  return {
    show,
    value,
    isRandom,
    onCancel,
    onConfirm,
    onInputGen,
    onRandomGen,
  }
}
