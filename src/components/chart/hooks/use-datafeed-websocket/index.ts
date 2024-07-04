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

interface Options {
  onReconnect?: (e: Event) => void
  reconnectDelay?: number
}

export const useDatafeedWebsocket = ({
  onReconnect,
  reconnectDelay = 500,
}: Options = {}) => {
  const emitter = useEmitter<DatafeedOnEvents, DatafeedEmitEvents>()
  const wsRef = useRef<WebSocket>()
  const timerRef = useRef<number>()
  // Do not speculate or interpret further here,
  // as it cannot obtain the latest status!!!
  // const { chart } = useChartStore()

  // Keep heartbeat.
  const onOpen = () => {
    timerRef.current = window.setInterval(() => {
      sendMessage(heartbetaMessage)
    }, 10_000) // Each 10s.
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
        onOpen()
        resolve(e)
      })
      wsRef.current.addEventListener('close', (e) => {
        if (!useChartStore.getState().chart) return
        setTimeout(() => onReconnect?.(e), reconnectDelay)
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
    emitter,
    connect,
    disconenct,
    listenAsync,
    historyAsync,
    onUpdate,
  }
}
