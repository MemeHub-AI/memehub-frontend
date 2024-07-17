import { dotenv } from './env'

// Only output in dev mode.
export const logger = (...outputs: any[]) => {
  if (dotenv.isProd) return
  console.log(...outputs)
}

export const loggerError = (...outputs: any[]) => {
  if (dotenv.isProd) return
  console.error(...outputs)
}
