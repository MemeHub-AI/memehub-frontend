import { dotenv } from './env'

// Only output in dev mode.
export const logger = (...outputs: any[]) => {
  if (dotenv.isProd) return
  console.log(...outputs)
}
