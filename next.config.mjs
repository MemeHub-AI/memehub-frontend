import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@tanstack/query-core'],
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_ENV === 'prod',
  },
}

export default withSentryConfig(nextConfig, {
  org: 'satoshiailab',
  project: 'memehub',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
})
