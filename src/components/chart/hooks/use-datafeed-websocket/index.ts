import { useRef } from 'react'
import { isEmpty } from 'lodash'

import type {
  DatafeedBar,
  DatafeedBaseData,
  DatafeedEmitEvents,
  DatafeedEmitHistory,
  DatafeedEmitListen,
  DatafeedEventBase,
  DatafeedOnEvents,
} from './types'
import { wsApiUrl } from '@/api/websocket'
import { useEmitter } from '@/hooks/use-emitter'
import { useChartStore } from '@/stores/use-chart-store'
import { reportException } from '@/errors'

const heartbetaMessage = {
  type: 'heartbeat',
  message: 'ping',
  data: null,
}

interface Options {
  onReconnect?: (e: Event) => void
  reconnectDelay?: number
}

// TODO: should refactor it
export const useDatafeedWebsocket = ({
  onReconnect,
  reconnectDelay = 500,
}: Options = {}) => {
  const emitter = useEmitter<DatafeedOnEvents, DatafeedEmitEvents>()
  const wsRef = useRef<WebSocket>()
  const timerRef = useRef<number>()

  // Keep heartbeat.
  const onOpen = () => {
    sendMessage(heartbetaMessage)
    timerRef.current = window.setInterval(() => {
      sendMessage(heartbetaMessage)
    }, 30_000) // 30s
  }

  // Emit listened events.
  const onMessage = (e: MessageEvent<any>) => {
    try {
      const message = JSON.parse(e.data)
      emitter.emit(message.type, message)
    } catch (error) {
      reportException(error)
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
      wsRef.current = new WebSocket(wsApiUrl.candlestick)
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
        emitter.on('candles', (v) => v.data && resolve(v))
        sendMessage({ type: 'listen', data: data })
      }
    )
  }

  // Get history data.
  const historyAsync = (data: DatafeedEmitHistory) => {
    return withPromise<DatafeedEventBase<'listen', DatafeedBar[]>>(
      async (resolve, reject) => {
        emitter.on('candles', (v) => v.data && resolve(v))
        sendMessage({ type: 'history', data })
      }
    )
  }

  // Listen update data
  const onUpdate = (
    fn: (
      data: DatafeedEventBase<'candles', DatafeedBaseData<DatafeedBar[]>>
    ) => void
  ) => {
    emitter.on('update', (value) => {
      if (!value.data) return
      fn(value.data)
    })
  }

  return {
    ws: emitter,
    connect,
    disconenct,
    listenAsync,
    historyAsync,
    onUpdate,
  }
}
