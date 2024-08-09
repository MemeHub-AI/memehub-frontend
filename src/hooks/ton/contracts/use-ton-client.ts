import { TonClient } from '@ton/ton'
import { useInit } from './use-init'
import { useTonMainAddress } from '../use-ton-address'

export function useTonClient() {
  // console.log(11111111)
  const { api_key } = useTonMainAddress()

  return useInit(
    async () =>
      new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC', // test network
        apiKey: api_key,
      })
  )
}
