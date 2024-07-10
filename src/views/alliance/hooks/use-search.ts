import { useState } from 'react'
import { debounce } from 'lodash'

export const useSearch = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const onInput = async (value: string) => {
    if (value.trim() === '') {
      setValue('')
      return
    }
    setLoading(true)
    setValue(value.trim())
    //     try {
    // await
    //     }
  }

  return {
    value,
    onInput: debounce(onInput, 500),
  }
}
