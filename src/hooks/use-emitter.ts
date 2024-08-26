import { useRef } from 'react'

export type OnEvents<T = any> = Record<string, T>

export type EmitEvents<T = any> = Record<string, T>

export type EventHandler<T> = (arg: T) => void

export const useEmitter = <OnEvents, EmitEvents>() => {
  const eventsRef = useRef<Record<string, EventHandler<any>[]>>({})

  const on = <E extends keyof OnEvents>(
    e: E,
    handler: EventHandler<OnEvents[E]>
  ) => {
    const { current } = eventsRef

    if (!current[e as string]) {
      current[e as string] = []
    }

    current[e as string].push(handler)
  }

  const emit = <E extends keyof EmitEvents>(e: E, data: EmitEvents[E]) => {
    const handlers = eventsRef.current[e as string]
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  const off = <E extends keyof OnEvents>(event: E) => {
    delete eventsRef.current[event as string]
    if (Object.keys(eventsRef).length === 0) {
      eventsRef.current = {}
    }
  }

  const offAll = () => {
    eventsRef.current = {}
  }

  return {
    events: eventsRef,
    on,
    emit,
    off,
    offAll,
  }
}
