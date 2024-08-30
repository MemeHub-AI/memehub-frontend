export const qs = {
  stringify: (query?: Record<string, any> | string[][], withPrefix = true) => {
    const searchParams = new URLSearchParams(query)
    if (searchParams.size === 0) return ''

    return withPrefix ? `?${searchParams}` : searchParams.toString()
  },
  parse: (query?: string) => {
    if (!query) return {} as Record<string, string>

    const queryString = query.startsWith('?') ? query.slice(1) : query
    const queryParams = queryString.split('&').reduce((p, q) => {
      const [key, value] = q.split('=')
      return (p[key] = value), p
    }, {} as Record<string, string>)

    return queryParams
  },
}
