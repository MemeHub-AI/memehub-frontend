import { useRef } from 'react'
import { isEmpty } from 'lodash'

import type {
  CandlestickBar,
  CandlestickEmitEvents,
  CandlestickEmitHistory,
  CandlestickEmitListen,
  CandlestickEventBase,
  CandlestickOnEvents,
} from './types'

import { wsApiURL } from '@/api/websocket'
import { useEmitter } from '@/hooks/use-emitter'

const HEARTBEAT_MESSAGE = JSON.stringify({
  type: 'heartbeat',
  message: 'ping',
  data: null,
})

export const useDatafeedWebsocket = () => {
  const emitter = useEmitter<CandlestickOnEvents, CandlestickEmitEvents>()
  const wsRef = useRef<WebSocket>()
  const timerRef = useRef<number>()

  // Keep heartbeat.
  const onOpen = () => {
    wsRef.current?.send(HEARTBEAT_MESSAGE)
    timerRef.current = window.setInterval(() => {
      wsRef.current?.send(HEARTBEAT_MESSAGE)
    }, 10_000)
  }

  // Emit listened events.
  const onMessage = (e: MessageEvent<any>) => {
    try {
      const message = JSON.parse(e.data)
      emitter.emit(message.type, message)
    } catch (error) {
      console.log('[onMessage JSON.parse error]:', error)
    }
  }

  // Send message to server side.
  const sendMessage = <T>(data: T) => {
    wsRef.current?.send(JSON.stringify(data))
  }

  // Connect websocket.
  const connect = () => {
    return new Promise((resolve, reject) => {
      wsRef.current = new WebSocket(wsApiURL.candlestick)
      wsRef.current.addEventListener('open', (data) => {
        onOpen()
        resolve(data)
      })
      wsRef.current.addEventListener('error', reject)
      wsRef.current.addEventListener('message', onMessage)
    })
  }

  // Disconnect websocket.
  const disconenct = () => {
    wsRef.current?.close()
    clearInterval(timerRef.current)
  }

  // Wrap promise & auto connect.
  const withPromise = async <T>(
    executor: (resolve: (value: T) => void, reject: () => void) => void,
    debugCaller: string
  ) => {
    return new Promise<T>(async (resolve, reject) => {
      console.log('withPromise caller:', debugCaller)
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        await connect()
      }
      executor(resolve, reject)
    })
  }

  // Get init data.
  const listenAsync = (data: CandlestickEmitListen) => {
    return withPromise<CandlestickEventBase<'listen', CandlestickBar[]>>(
      async (resolve, reject) => {
        emitter.on('listen', (v) => v.data && resolve(v))
        sendMessage({ type: 'listen', data })
      },
      listenAsync.name
    )
  }

  // Get history data.
  const historyAsync = (data: CandlestickEmitHistory) => {
    return withPromise<CandlestickEventBase<'history', CandlestickBar[]>>(
      async (resolve, reject) => {
        emitter.on('history', (v) => v.data && resolve(v))
        sendMessage({ type: 'history', data })
      },
      historyAsync.name
    )
  }

  // Listen update data
  const onUpdate = (
    fn: (data: CandlestickEventBase<'update', CandlestickBar[]>) => void
  ) => {
    emitter.on('update', (value) => {
      if (!value.data || isEmpty(value.data)) return
      fn(value)
    })
  }

  return {
    connect,
    disconenct,
    listenAsync,
    historyAsync,
    onUpdate,
  }
}
