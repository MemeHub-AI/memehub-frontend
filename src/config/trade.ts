import {
  bscTestnet,
  zkSyncSepoliaTestnet,
  fantomTestnet,
  polygonAmoy,
  polygonZkEvmCardona,
  bsc,
  zkSync,
  fantom,
  polygon,
} from 'wagmi/chains'

import { TRADE_BUY_ITEMS } from '@/constants/contract'

// Special match, if non-ETH.
export const tradeBuyItems = {
  // BSC
  [bscTestnet.id]: TRADE_BUY_ITEMS.bnb,
  [bsc.id]: TRADE_BUY_ITEMS.bnb,

  // zkSync
  [zkSync.id]: TRADE_BUY_ITEMS.zk,
  [zkSyncSepoliaTestnet.id]: TRADE_BUY_ITEMS.zk,

  // Fantom
  [fantom.id]: TRADE_BUY_ITEMS.ftm,
  [fantomTestnet.id]: TRADE_BUY_ITEMS.ftm,

  // Polygon
  [polygon.id]: TRADE_BUY_ITEMS.matic,
  [polygonAmoy.id]: TRADE_BUY_ITEMS.matic,
  [polygonZkEvmCardona.id]: TRADE_BUY_ITEMS.matic,

  // BTC
  // [btc.id]: TRADE_BUY_ITEMS.btc,
}
