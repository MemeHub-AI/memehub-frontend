import { Options } from 'react-use-websocket'

export const wsBaseOptions: Options = {
  heartbeat: {
    message: 'heartbeat',
    interval: 30_000, // 30s
  },
  onOpen: () => {},
}
