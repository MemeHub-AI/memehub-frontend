export const dotenv = {
  isDev: process.env.NEXT_PUBLIC_ENV === 'dev',
  isProd: process.env.NEXT_PUBLIC_ENV === 'prod',
}
