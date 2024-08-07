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

const items = {
  eth: ['0.05', '0.1', '0.2', '0.5'],
  bnb: ['0.2', '0.5', '1', '2'],
  zk: ['500', '1000', '3000', '5000'],
  ftm: ['150', '300', '600', '1000'],
  matic: ['150', '300', '600', '1000'],

  btc: ['0.004', '0.008', '0.016', '0.03'],
} as const

// Special match, if non-ETH.
export const tradeBuyItems = {
  // BSC
  [bscTestnet.id]: items.bnb,
  [bsc.id]: items.bnb,

  // zkSync
  [zkSync.id]: items.zk,
  [zkSyncSepoliaTestnet.id]: items.zk,

  // Fantom
  [fantom.id]: items.ftm,
  [fantomTestnet.id]: items.ftm,

  // Polygon
  [polygon.id]: items.matic,
  [polygonAmoy.id]: items.matic,
  [polygonZkEvmCardona.id]: items.matic,

  // BTC
  // [btc.id]: TRADE_BUY_ITEMS.btc,
}

// By default, use eth.
export const tradeDefaultItems = items.eth
