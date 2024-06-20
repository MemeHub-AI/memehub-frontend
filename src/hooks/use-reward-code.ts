import { useLocation } from 'react-use'
export const useRewardCode = () => {
  const REWAR_QUERY = 'r'
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const rewardCode = searchParams.get(REWAR_QUERY)

  return rewardCode
}
