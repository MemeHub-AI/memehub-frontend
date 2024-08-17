import { useEffect, useMemo } from 'react'
import useWebSocket, { Options, ReadyState } from 'react-use-websocket'

import { useEmitter, type OnEvents, type EmitEvents } from './use-emitter'
import { WsReceived } from '@/api/types'

const filterHeartbeta = (message: MessageEvent<any>) => {
  try {
    const msg = JSON.parse(message.data)
    return msg.type !== 'heartbeat'
  } catch (error) {
    console.error('[filterHeartbeta error]', error)
    return true
  }
}

// Based on react-use-websocket
export const useWebsocket = <
  OEvents extends OnEvents,
  EEvents extends EmitEvents
>(
  url: string,
  options?: Options
) => {
  type AllEvents = OEvents & EEvents

  const emitter = useEmitter<OEvents, AllEvents>() // `EmitEvents` must contain all events
  const { lastJsonMessage, sendJsonMessage, ...ws } = useWebSocket<
    WsReceived<OEvents> // Ws only can received events
  >(
    url,
    {
      onOpen: () => sendJsonMessage({ type: 'heartbeat' }),
      filter: filterHeartbeta,
      ...options,
    },
    !!url
  )
  const [isConnecting, isOpen, isClosing, isClosed] = useMemo(
    () => [
      ws.readyState === ReadyState.CONNECTING,
      ws.readyState === ReadyState.OPEN,
      ws.readyState === ReadyState.CLOSING,
      ws.readyState === ReadyState.CLOSED,
    ],
    [ws.readyState]
  )

  // Emit an event, cannot use `emitter.emit`,
  // because we need to send message to websocket.
  const emit = <T extends keyof EEvents>(type: T, data: EEvents[T]) => {
    if (!isOpen) {
      throw new Error('[useWebsocket]: websocket not connected')
    }
    sendJsonMessage({ type, data })
    emitter.emit(type, data as AllEvents[T])
  }

  // Listen all events, it's only contain `OEvents`
  useEffect(() => {
    if (!lastJsonMessage) return
    const { type, data } = lastJsonMessage

    emitter.emit(type, data as AllEvents[typeof type])
  }, [lastJsonMessage])

  return {
    ...ws,
    isConnecting,
    isOpen,
    isClosing,
    isClosed,
    on: emitter.on,
    emit,
  }
}
