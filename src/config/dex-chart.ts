export const dexChartBaseUrl = 'https://dexscreener.com'

export const dexChainMap = {
  bsc: 'bnb',
  base: 'base',
  blast: 'blast',

  // unconfigured
  ETHEREUM: 'ether',
  POLYGON: 'polygon',
  FANTOM: 'fantom',
  CRONOS: 'cronos',
  AVALANCHE: 'avalanche',
  VELAS: 'velas',
  OASIS: 'oasis',
  KCC: 'kucoin',
  METIS: 'metis',
  OPTIMISM: 'optimism',
  ARBITRUM: 'arbitrum',
  CELO: 'celo',
  TELOS: 'telos',
  AURORA: 'aurora',
  MOONBEAM: 'moonbeam',
  MOONRIVER: 'moonriver',
  HARMONY: 'harmony',
  FUSE: 'fuse',
  HECO: 'heco',
  OKC: 'okc',
  ASTAR: 'astar',
  KLAYTN: 'klaytn',
  IOTEX: 'iotex',
  MILKOMEDA: 'milkomeda',
  'AVAX DFK': 'dfk',
  SOLANA: 'solana',
  EVMOS: 'evmos',
  'DOGE CHAIN': 'dogechain',
  'ETHEREUM CLASSIC': 'etc',
  GNOSIS: 'gnosis',
  BITGERT: 'bitgert',
  CANTO: 'canto',
  FLARE: 'flare',
  'ARBITRUM NOVA': 'arbitrumnova',
  REDLIGHT: 'redlight',
  CONFLUX: 'conflux',
  SMARTBCH: 'smartbch',
  KARDIA: 'kardia',
  TOMB: 'tomb',
  WAN: 'wan',
  BOBA: 'boba',
  ELASTOS: 'elastos',
  NOVA: 'nova',
  HOO: 'hoo',
  SHIDEN: 'shiden',
  FUSION: 'fusion',
  RSK: 'rsk',
  CUBE: 'cube',
  SYSCOIN: 'syscoin',
  KAVA: 'kava',
  THUNDERCORE: 'thundercore',
  ECHELON: 'echelon',
  METER: 'meter',
  KEK: 'kek',
  TOMO: 'tomo',
  RONIN: 'ronin',
  SHIB: 'shib',
  'ETHEREUM POW': 'ethw',
  'ETHEREUM FAIR': 'ethf',
  MUU: 'muu',
  SX: 'sx',
  ALVEY: 'alvey',
  APTOS: 'aptos',
  MULTIVERSX: 'multiversx',
  'PROOF OF MEMES': 'pom',
  EXOSAMA: 'exosama',
  ENERGI: 'energi',
  GOERLI: 'ethergoerli',
  'CORE DAO': 'coredao',
  FILECOIN: 'filecoin',
  ZKSYNC: 'zksync',
  'POLYGON-ZKEVM': 'polygonzkevm',
  PULSE: 'pulse',
  LINEA: 'linea',
  MANTLE: 'mantle',
  BITROCK: 'bitrock',
  OPBNB: 'opbnb',
  SHIBARIUM: 'shib',
  STARKNET: 'starknet',
  SCROLL: 'scroll',
  MANTA: 'manta',
  KUJIRA: 'kujira',
  BITTORRENT: 'bittorrent',
  OSMOSIS: 'osmosis',
  'X LAYER': 'xlayer',
}

export type DexChain = keyof typeof dexChainMap