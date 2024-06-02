import { useStorage } from './use-storage'

export enum CommonHeaders {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
}

export enum ContentType {
  Text = 'text/plain;',
  Json = 'application/json;',
  FormData = 'multipart/form-data;',
}

export interface FetcherOptions extends Omit<RequestInit, 'body'> {
  contentType?: ContentType
  body?: Record<string, any> | null | FormData
  requireAuth?: boolean
  toJson?: boolean
}

export type AliasOptions = Omit<FetcherOptions, 'method'>

/**
 * A reusable fetch function, You just need
 * to modify `useStorage` or implement it.
 * @param baseURL
 * @returns
 */
export const useFetch = (baseURL: string) => {
  const { getToken } = useStorage()

  // Init headers config.
  const initHeaders = ({ requireAuth = true, headers }: FetcherOptions) => {
    const newHeaders = new Headers(headers)

    // Content-Type header.
    if (!newHeaders.has(CommonHeaders.ContentType)) {
      newHeaders.set(CommonHeaders.ContentType, ContentType.Json)
    }

    // Delete form-data content-type.
    if (newHeaders.get(CommonHeaders.ContentType) === ContentType.FormData) {
      newHeaders.delete(CommonHeaders.ContentType)
    }

    // Auth header.
    if (
      requireAuth &&
      getToken()?.trim() &&
      !newHeaders.get(CommonHeaders.Authorization)
    ) {
      newHeaders.set(CommonHeaders.Authorization, `Bearer ${getToken()}`)
    }

    return newHeaders
  }

  // Process response success.
  const processSuccess = async <T>(
    response: Response,
    { toJson = true }: FetcherOptions
  ) => {
    const contentType = response.headers.get('content-type')

    // Extract json.
    const isJson = ContentType.Json.includes(contentType ?? '')
    if (isJson && toJson) return (await response.json()) as T

    // More process...

    return response
  }

  // Main fetch function.
  const fetcher = async <T>(path: string, options: FetcherOptions) => {
    const fullURL = `${baseURL}${path}`

    // Handle headers.
    options.headers = initHeaders(options)

    // Handle response.
    try {
      const response = await fetch(fullURL, {
        ...options,
        body:
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
      })
      // Response error.
      if (!response.ok) return response.body as T

      // Response success.
      return processSuccess(response, options) as T
    } catch (error) {
      console.error('[useFetch Error]:', error)
      return error as T
    }
  }

  return {
    GET: <T>(path: string, options?: AliasOptions) => {
      return fetcher<T>(path, { ...options, method: 'GET' })
    },
    POST: <T>(path: string, options?: AliasOptions) => {
      return fetcher<T>(path, { ...options, method: 'POST' })
    },
    PUT: <T>(path: string, options?: AliasOptions) => {
      return fetcher<T>(path, { ...options, method: 'PUT' })
    },
    DELETE: <T>(path: string, options?: AliasOptions) => {
      return fetcher<T>(path, { ...options, method: 'DELETE' })
    },
    PATCH: <T>(path: string, options?: AliasOptions) => {
      return fetcher<T>(path, { ...options, method: 'PATCH' })
    },
  }
}

export const qs = {
  stringify(query?: Record<string, any>, withPrefix = true) {
    const searchParams = new URLSearchParams(query)

    if (searchParams.size === 0) return ''
    return withPrefix ? `?${searchParams}` : searchParams.toString()
  },
  parse(query?: string) {
    if (!query) return {}
  },
}
