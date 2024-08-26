import { useMediaQuery } from 'react-responsive'

export enum DeviceWidth {
  Mobile = 640,

  Pad = 1024,

  Laptop = 1140,

  Desktop = 1024,

  Xl = 1280,

  Xl2 = 1380,
}

// TODO/middle: use ahooks's `useResponsive` to instead.
export const useResponsive = () => {
  return {
    isMobile: useMediaQuery({ query: `(max-width: ${DeviceWidth.Mobile}px)` }),
    isPad: useMediaQuery({ query: `(max-width: ${DeviceWidth.Pad}px)` }),
    isLaptop: useMediaQuery({ query: `(max-width: ${DeviceWidth.Laptop}px)` }),
    isDesktop: useMediaQuery({
      query: `(min-width: ${DeviceWidth.Desktop}px)`,
    }),
    isXl: useMediaQuery({
      query: `(max-width: ${DeviceWidth.Xl}px)`,
    }),
    isXl2: useMediaQuery({
      query: `(max-width: ${DeviceWidth.Xl2}px)`,
    }),
  }
}
