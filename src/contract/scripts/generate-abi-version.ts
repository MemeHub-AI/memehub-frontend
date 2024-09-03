import { readdirSync, readFileSync } from 'fs'
import { version } from 'os'
import { join } from 'path'

const abiRootPath = join(__dirname, '../abi')

const contractPathMap = {
  bc: {
    path: '/bonding-curve',
    varPrefix: 'bcAbi',
  },
  airdrop: {
    path: '/distributor',
    varPrefix: 'distributorAbi',
  },
  token: {
    path: '/token',
    varPrefix: 'tokenAbi',
  },
  recommend: {
    path: '/recommend',
    varPrefix: 'recommendAbi',
  },
  'memex-factory': {
    path: '/memex/factory',
    varPrefix: 'memexFactoryAbi',
  },
  'memex-ido': {
    path: '/memex/ido',
    varPrefix: 'memexIdoAbi',
  },
}

const main = async () => {
  const [, , shortName] = process.argv
  const contract = contractPathMap[shortName as keyof typeof contractPathMap]

  if (!shortName || !contract) {
    throw new Error(`Invalid dir arg '${shortName}'`)
  }

  const path = abiRootPath + contract.path
  const files = readdirSync(path).map((f) => f.replace('.ts', ''))

  const indexFileName = `${files.splice(-1, 1)}.ts`
  const indexFile = readFileSync(`${path}/${indexFileName}`, {
    encoding: 'utf-8',
  })
  const lines = indexFile.split('\n')

  const importEndLine = lines.findLastIndex((l) => l.includes('import {')) + 1
  const imports = lines.slice(0, importEndLine)

  const mapStartLine = lines.findIndex((l) => l.includes('export const')) + 1
  const mapEndLine = lines.findLastIndex((l) => l.includes('as const')) + 1
  const versions = lines.slice(mapStartLine, mapEndLine)
  const restLines = lines.slice(mapEndLine + 1)

  const newVersions = files.filter((f) => !imports.some((i) => i.includes(f)))

  for (const v of newVersions) {
    // Adding to `imports`
    const camelSnake = `${contract.varPrefix}${v.split('.').join('_')}`

    imports.push(`import { ${camelSnake} } from '${v}'`)

    // Adding to `versions`
    versions.splice(-1, 0, `  '${v}': ${camelSnake},`)
  }

  console.log('gen abi version', restLines)
}

main()
