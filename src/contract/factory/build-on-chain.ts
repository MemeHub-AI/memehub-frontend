import { beginCell, Cell } from '@ton/ton'
import { Dictionary } from '@ton/core'
import { sha256_sync } from '@ton/crypto'

const ONCHAIN_CONTENT_PREFIX = 0x00

export interface SendCoinsContent {
  name: string
  description: string
  image: string
  symbol: string
}
const toKey = (key: string) => {
  const result = BigInt(`0x${sha256_sync(key).toString('hex')}`)
  // console.log(key, result);
  return result
}

export function buildOnchainMetadata(data: SendCoinsContent): Cell {
  const dict = Dictionary.empty(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell()
  )
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') {
      dict.set(
        toKey(key),
        beginCell().storeUint(0, 8).storeUint(value, 8).endCell()
      )
    } else {
      dict.set(
        toKey(key),
        beginCell()
          .storeUint(0, 8)
          .storeStringTail(value as string)
          .endCell()
      )
    }
  })

  return beginCell()
    .storeInt(ONCHAIN_CONTENT_PREFIX, 8)
    .storeDict(dict)
    .endCell()
}
