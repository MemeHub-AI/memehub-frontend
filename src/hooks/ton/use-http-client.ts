import { HttpClient, Api } from 'tonapi-sdk-js'

export const useHttpClient = () => {
  const api_key =
    'AECMBOEJQGAC3QAAAAADW7PKEBS2DZPESAQOEXBJKOVKP7TYOUR2SV3GNXVWWEHRXXXMQPY'

  const httpClient = new HttpClient({
    baseUrl: 'https://testnet.tonapi.io',
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-type': 'application/json',
      },
    },
  })

  // Initialize the API client
  const client = new Api(httpClient)

  const getTraceApi = async (transactionID: string) => {
    return await client.traces.getTrace(transactionID)
  }

  return {
    getTraceApi,
  }
}
