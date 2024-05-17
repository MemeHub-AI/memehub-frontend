import { useMediaQuery } from 'react-responsive'

export enum DeviceWidth {
  Mobile = 640,

  Pad = 1024,

  Desktop = 1024,
}

export const useResponsive = () => {
  return {
    isMobile: useMediaQuery({ query: `(max-width: ${DeviceWidth.Mobile}px)` }),
    isPad: useMediaQuery({ query: `(max-width: ${DeviceWidth.Pad}px)` }),
    isDesktop: useMediaQuery({
      query: `(min-width: ${DeviceWidth.Desktop}px)`,
    }),
  }
}
