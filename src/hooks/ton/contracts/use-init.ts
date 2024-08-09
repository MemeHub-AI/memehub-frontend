import { useEffect, useState } from "react"

export function useInit<T>(func: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<T | undefined>()
  const set = async () => {
    setState(await func())
  }

  useEffect(() => {
    set()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
