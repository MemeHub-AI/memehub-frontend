export const animatedShakeRef = <T extends HTMLElement>(
  el: T | null,
  delay = 1000
) => {
  const shakeClass = 'animate-h-shake'

  el?.classList.add(shakeClass)
  el?.addEventListener('animationiteration', () => {
    el?.classList.remove(shakeClass)
    setTimeout(() => {
      el?.classList.add(shakeClass)
    }, delay)
  })
}
