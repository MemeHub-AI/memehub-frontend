const chains = [
  {
    id: 1,
    name: 'Scroll',
  },
  {
    id: 1,
    name: 'Ethereum',
    disabled: true,
  },
]

export const useChainConfig = () => {
  return {
    chains,
  }
}
