export const ERR = {
  notFound: (value: string) => {
    return new Error(`${value} is not found.`)
  },
}
