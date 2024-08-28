import { useLocalStorage } from './use-storage'
import { ApiCode, ApiResponse } from '@/api/types'
import { REQUEST_ERR } from '@/errors/request'

export enum CommonHeaders {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
}

export enum ContentType {
  Text = 'text/plain',
  Json = 'application/json',
  FormData = 'multipart/form-data',
}

export interface FetcherOptions extends Omit<RequestInit, 'body'> {
  contentType?: ContentType
  body?: Record<string, any> | null | FormData
  requireAuth?: boolean
  toJson?: boolean
}

export type AliasOptions = Omit<FetcherOptions, 'method'>

export const useFetch = (baseURL: string) => {
  const { getStorage, removeStorage } = useLocalStorage()

  // Init headers config.
  const initHeaders = ({ requireAuth = true, headers }: FetcherOptions) => {
    const newHeaders = new Headers(headers)
    const token = getStorage('token')

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
      token?.trim() &&
      !newHeaders.get(CommonHeaders.Authorization)
    ) {
      newHeaders.set(CommonHeaders.Authorization, `Bearer ${token}`)
    }

    return newHeaders
  }

  // Main fetch function.
  const fetcher = async <T>(path: string, options: FetcherOptions) => {
    const { toJson = true } = options
    // Handle headers.
    options.headers = initHeaders(options)

    // Handle response.
    try {
      const response = await fetch(`${baseURL}${path}`, {
        ...options,
        body:
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
      })

      if (response.status === ApiCode.AuthError) removeStorage('token')

      // Response error.
      if (!response.ok) throw response

      // Extract json.
      if (isJson(response.headers) && toJson) {
        const data = (await response.json()) as ApiResponse<T>

        if (data.code !== ApiCode.Success && data.code !== 0) {
          throw data
        }

        return data as T
      }

      // Response success.
      return response as T
    } catch (e) {
      REQUEST_ERR.message(e)
      throw e
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

const isJson = (h: Headers) => {
  return h.get(CommonHeaders.ContentType)?.includes(ContentType.Json)
}
