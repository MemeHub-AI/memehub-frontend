import { useRef } from 'react'
import { isEmpty } from 'lodash'

import type {
  DatafeedBar,
  DatafeedEmitEvents,
  DatafeedEmitHistory,
  DatafeedEmitListen,
  DatafeedEventBase,
  DatafeedOnEvents,
} from './types'

import { wsApiURL } from '@/api/websocket'
import { useEmitter } from '@/hooks/use-emitter'
import { useChartStore } from '@/stores/use-chart-store'

const heartbetaMessage = {
  type: 'heartbeat',
  message: 'ping',
  data: null,
}

const heartbeatFreq = 10 // unit is seconds

interface Options {
  onReconnect?: (e: Event) => void
}

export const useDatafeedWebsocket = ({ onReconnect }: Options = {}) => {
  const emitter = useEmitter<DatafeedOnEvents, DatafeedEmitEvents>()
  const wsRef = useRef<WebSocket>()
  const timerRef = useRef<number>()
  const { chart } = useChartStore()

  // Keep heartbeat.
  const onOpen = () => {
    sendMessage(heartbetaMessage)
    timerRef.current = window.setInterval(() => {
      sendMessage(heartbetaMessage)
    }, heartbeatFreq * 1000)
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
    if (wsRef.current?.readyState !== WebSocket.OPEN) return
    wsRef.current?.send(JSON.stringify(data))
  }

  // Connect websocket.
  const connect = () => {
    return new Promise<Event>((resolve, reject) => {
      wsRef.current = new WebSocket(wsApiURL.chart)
      wsRef.current.addEventListener('open', (e) => {
        console.log('chart ws open', e)
        onOpen()
        resolve(e)
      })
      wsRef.current.addEventListener('close', (e) => {
        console.log('chart ws close', e)
        chart && onReconnect?.(e) // Reconnect if chart exist.
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
    executor: (resolve: (value: T) => void, reject: () => void) => void
  ) => {
    return new Promise<T>(async (resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        await connect()
      }
      executor(resolve, reject)
    })
  }

  // Get init data.
  const listenAsync = (data: DatafeedEmitListen) => {
    return withPromise<DatafeedEventBase<'listen', DatafeedBar[]>>(
      async (resolve, reject) => {
        emitter.on('listen', (v) => v.data && resolve(v))
        sendMessage({ type: 'listen', data })
      }
    )
  }

  // Get history data.
  const historyAsync = (data: DatafeedEmitHistory) => {
    return withPromise<DatafeedEventBase<'history', DatafeedBar[]>>(
      async (resolve, reject) => {
        emitter.on('history', (v) => v.data && resolve(v))
        sendMessage({ type: 'history', data })
      }
    )
  }

  // Listen update data
  const onUpdate = (
    fn: (data: DatafeedEventBase<'update', DatafeedBar[]>) => void
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
