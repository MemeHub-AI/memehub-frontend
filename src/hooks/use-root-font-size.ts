import { useEffect } from 'react'

export const useRootFontSize = () => {
  // only adapt 125% pixel ratio now.
  const calcFontSize = () => {
    const ratio = window.devicePixelRatio.toString()

    const classes = 'text-sm'
    if (ratio.includes('1.2')) {
      document.documentElement.classList.add(classes)
    } else {
      document.documentElement.classList.remove(classes)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', calcFontSize)
    return () => window.removeEventListener('resize', calcFontSize)
  }, [])
}
