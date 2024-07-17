import { Address } from 'viem'
import {
  mainnet,
  scroll,
  bsc,
  opBNB,
  base,
  blast,
  fantom,
  linea,

  // testnet
  bscTestnet,
  opBNBTestnet,
  baseSepolia,
  blastSepolia,
  fantomTestnet,
} from 'wagmi/chains'

export const uniswapV2Addr: Record<number, Address> = {
  [mainnet.id]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [scroll.id]: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
  [bsc.id]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [opBNB.id]: '0x8cfe327cec66d1c090dd72bd0ff11d690c33a2eb',
  [base.id]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  [blast.id]: '0x44889b52b71E60De6ed7dE82E2939fcc52fB2B4E',
  [fantom.id]: '0x31F63A33141fFee63D4B26755430a390ACdD8a4d',
  [linea.id]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',

  // testnet.
  [bscTestnet.id]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [opBNBTestnet.id]: '0x62ff25cfd64e55673168c3656f4902bd7aa5f0f4',
  [baseSepolia.id]: '0x1689E7B1F10000AE47eBfE339a4f69dECd19F602',
  [blastSepolia.id]: '0x974dC76e9fA2c15DbE1b13db93c12478857BaC25',
  [fantomTestnet.id]: '0xd38fd047a692c0ae627929a88e5f435d5f777efa',
}
