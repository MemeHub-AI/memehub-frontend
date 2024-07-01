export const CONTEXT_ERR = {
  notFound: (provider: string) => {
    return new Error(`${provider} is not found.`)
  },
}
