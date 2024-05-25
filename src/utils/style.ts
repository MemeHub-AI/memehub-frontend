const marginName = ['m-', 'mt-', 'mr-', 'mb-', 'ml-', 'mx-', 'my-']
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
