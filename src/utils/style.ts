const marginName = [
  'm-',
  'mt-',
  'mr-',
  'mb-',
  'ml-',
  'mx-',
  'my-',
  'max-sm:m-',
  'max-md:m-',
  'max-xl:m-',
  'max-2xl:m-',
  'max-lg:m-',
  'sm:m-',
  'lg:m-',
  'xl:m-',
  'md:m-',
  '2xl:m-',
  'max-sm:mt-',
  'max-md:mt-',
  'max-xl:mt-',
  'max-2xl:mt-',
  'max-lg:mt-',
  'sm:mt-',
  'lg:mt-',
  'xl:mt-',
  'md:mt-',
  '2xl:mt-',
  'max-sm:mr-',
  'max-md:mr-',
  'max-xl:mr-',
  'max-2xl:mr-',
  'max-lg:mr-',
  'sm:mr-',
  'lg:mr-',
  'xl:mr-',
  'md:mr-',
  '2xl:mr-',
  'max-sm:mb-',
  'max-md:mb-',
  'max-xl:mb-',
  'max-2xl:mb-',
  'max-lg:mb-',
  'sm:mb-',
  'lg:mb-',
  'xl:mb-',
  'md:mb-',
  '2xl:mb-',
  'max-sm:ml-',
  'max-md:ml-',
  'max-xl:ml-',
  'max-2xl:ml-',
  'max-lg:ml-',
  'sm:ml-',
  'lg:ml-',
  'xl:ml-',
  'md:ml-',
  '2xl:ml-',
  'max-sm:mx-',
  'max-md:mx-',
  'max-xl:mx-',
  'max-2xl:mx-',
  'max-lg:mx-',
  'sm:mx-',
  'lg:mx-',
  'xl:mx-',
  'md:mx-',
  '2xl:mx-',
  'max-sm:my-',
  'max-md:my-',
  'max-xl:my-',
  'max-2xl:my-',
  'max-lg:my-',
  'sm:my-',
  'lg:my-',
  'xl:my-',
  'md:my-',
  '2xl:my-',
]

export const utilStyle = {
  handleMargin(className?: string) {
    const margin: string[] = []
    const classname: string[] = []
    className?.split(' ').forEach((cname) => {
      for (let i = 0; i < marginName.length; i++) {
        if (cname.startsWith(marginName[i])) {
          margin.push(cname)
          break
        } else if (i === marginName.length - 1) {
          classname.push(cname)
        }
      }
    })
    return { margin, classname }
  },
}
