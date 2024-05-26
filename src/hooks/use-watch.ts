import { useEffect, useState } from 'react'

// Watch a state change, Will not be called when first mounted.
export const useWatch = <T>(value: T, onChange?: (newValue: T) => void) => {
  const [isFirstCall, setIsFirstCall] = useState(true)

  useEffect(() => {
    if (isFirstCall) {
      return setIsFirstCall(false)
    }
    onChange?.(value)
  }, [value])
}
