import { Address } from 'viem'
import {
  mainnet,
  scroll,
  opBNB,
  fantom,
  zkSync,
  linea,
  bsc,
  blast,
  base,

  /***** testnet *****/
  bscTestnet,
  opBNBTestnet,
  baseSepolia,
  blastSepolia,
  fantomTestnet,
  zkSyncSepoliaTestnet,
} from 'wagmi/chains'

import { dotenv } from '@/utils/env'

// Add new contract name here.
type Keys =
  | 'reserveToken'
  | 'uniswapv2Router'
  | 'bondingCurve'
  | 'recommend'
  | 'exchangeNft'
  | 'kolNft'
  | 'ido'
  | 'idoAirdrop'

type AddrMap = Record<number, Partial<Record<Keys, Address>> | undefined>

const prod: AddrMap = {
  [mainnet.id]: {
    reserveToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    uniswapv2Router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
  [bsc.id]: {
    reserveToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    uniswapv2Router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',

    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',

    ido: '0xCa96dC5e86543cd185B39Fe48194890c57b6a38f',
    idoAirdrop: '0x00d39283788ebD6cc029E2001EEfE1DedBB5Fa96',
  },
  [base.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    uniswapv2Router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',

    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',
  },
  [blast.id]: {
    reserveToken: '0x4300000000000000000000000000000000000004',
    uniswapv2Router: '0x44889b52b71E60De6ed7dE82E2939fcc52fB2B4E',

    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',
  },
  [opBNB.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    uniswapv2Router: '0x8cfe327cec66d1c090dd72bd0ff11d690c33a2eb',
  },
  [scroll.id]: {
    reserveToken: '0x5300000000000000000000000000000000000004',
    uniswapv2Router: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
  },
  [fantom.id]: {
    reserveToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    uniswapv2Router: '0x31F63A33141fFee63D4B26755430a390ACdD8a4d',
  },
  [zkSync.id]: {
    reserveToken: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  },
  [linea.id]: {
    uniswapv2Router: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  },
} as const

const dev: AddrMap = {
  [bsc.id]: {
    reserveToken: prod[bsc.id]?.reserveToken,
    uniswapv2Router: prod[bsc.id]?.uniswapv2Router,

    bondingCurve: '0x2d3b2Ff5930c1710204aE2c16E3C464De4a653EF',
    recommend: '0x80Ba6203Ac72bb8F4D807E3A58412Bc6B2A9f3da',

    exchangeNft: '0x5f5EAC903c8CCf445671580C178a7B6815519a12',
    kolNft: '0x5859AdD7DA6107D1FA4FC3aB98D242aAF310d61e',

    ido: '0xF7dbaBCC9B132D3a5f726357ecf5dDDC49DfDC84',
    idoAirdrop: '0xEFeA10E78F3D2a96A0A216C69ff530888C7de256',
  },
  [base.id]: {
    reserveToken: prod[base.id]?.reserveToken,
    uniswapv2Router: prod[base.id]?.uniswapv2Router,

    bondingCurve: '0x15374e7000d9633a3E7782998407Eb98293E478f',
    recommend: '0x9552e34D141725f812acE96014a6Bb5946cC3931',

    exchangeNft: '0xBe6544fb6041Fc0638D1E03A8ff41Fc718596758',
    kolNft: '0x416F8eAA8c46A02A7d967A7a3cf0464322c6EC71',
  },
  [blast.id]: {
    reserveToken: prod[blast.id]?.reserveToken,
    uniswapv2Router: prod[blast.id]?.uniswapv2Router,

    bondingCurve: '0x3558F554C56067cEa77457F7329FfB55189A29e3',
    recommend: '0x3e5E1904d24427441Fef1FdCFB2f7B9288b8BbeD',

    exchangeNft: '0xdBcf1F26CA92F61ba0C466a68F06460158339b05',
    kolNft: '0x0d23ffeeb39A15aC87695749540b6536cD1Dc1EE',
  },

  /***** testnet *****/
  [bscTestnet.id]: {
    reserveToken: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    uniswapv2Router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',

    bondingCurve: '0x06fa05905e63CEDfe9888a5F48fd25F0827b5AE0',
    recommend: '0xC2b2D1B0571638872d2E87AD46d18a6819DA6ACE',

    exchangeNft: '0x07ACeD5E05c6eD73fD74cf1A524d6730681cc8A0',
    kolNft: '0x6d2a5B705b08BaaE72bb3807fCB436e5eF7B1Edb',
  },
  [baseSepolia.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    uniswapv2Router: '0x1689E7B1F10000AE47eBfE339a4f69dECd19F602',
  },
  [blastSepolia.id]: {
    reserveToken: '0x4300000000000000000000000000000000000004',
    uniswapv2Router: '0x974dC76e9fA2c15DbE1b13db93c12478857BaC25',
  },
  [opBNBTestnet.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    uniswapv2Router: '0x62ff25cfd64e55673168c3656f4902bd7aa5f0f4',

    bondingCurve: '0x89C87817990F50b520f960C28b73e225E8C1Bbfc',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
  [fantomTestnet.id]: {
    reserveToken: '0x07B9c47452C41e8E00f98aC4c075F5c443281d2A',
    uniswapv2Router: '0xd38fd047a692c0ae627929a88e5f435d5f777efa',
  },
  [zkSyncSepoliaTestnet.id]: {
    reserveToken: '0x000000000000000000000000000000000000800A',
  },
}

export const addrMap = dotenv.isDev ? dev : prod
