import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { select } from '@inquirer/prompts'

const fileExtension = '.ts'

const abiRootPath = join(__dirname, '../abi')

const contractConfig = {
  all: {
    path: '',
    varPrefix: '',
  },
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

type Keys = keyof typeof contractConfig

const log = (...args: any[]) => {
  console.log('[gav]:', ...args)
}

const getFiles = (dirPath: string) => {
  const files = readdirSync(dirPath).map((f) => f.replace(fileExtension, ''))
  const indexFilePath = join(dirPath, files.splice(-1, 1) + fileExtension)
  const indexFileContent = readFileSync(indexFilePath, { encoding: 'utf-8' })

  return [files, indexFilePath, indexFileContent] as const
}

const getIndexFileLines = (file: string) => {
  const lines = file.split('\n')
  const importEndLine = lines.findLastIndex((l) => l.includes('import {')) + 1
  const importLines = lines.slice(0, importEndLine)

  const mapStartLine = lines.findIndex((l) => l.includes('export const')) + 1
  const mapEndLine = lines.findLastIndex((l) => l.includes('as const')) + 1
  const versionLines = lines.slice(mapStartLine - 1, mapEndLine)
  const restLines = lines.slice(mapEndLine + 1)

  return [importLines, versionLines, restLines] as const
}

const getNewVersions = (files: string[], filterArr: string[]) =>
  files.filter((f) => !filterArr.some((i) => i.includes(f)))

const getCamelSnake = (varName: string, v: string) =>
  `${varName}${v.split('.').join('_')}`

const getImportLine = (camelSnake: string, v: string) =>
  `import { ${camelSnake} } from './${v}'`

const getVersionLine = (camelSnake: string, v: string) =>
  `  '${v}': ${camelSnake},`

const generateAbiVersion = (k: Keys) => {
  log(`Start generate for '${k}'`)

  const { path, varPrefix } = contractConfig[k]
  const [files, indexFilePath, indexFileContent] = getFiles(
    join(abiRootPath, path)
  )
  const [importLines, versionLines, restLines] =
    getIndexFileLines(indexFileContent)
  const newVersions = getNewVersions(files, importLines)
  const isEmpty = newVersions.length <= 0

  if (isEmpty) {
    log('No new version found')
    log('Process end')
    return
  }

  log('New version found', newVersions)
  for (const v of newVersions) {
    const camelSnake = getCamelSnake(varPrefix, v)
    importLines.push(getImportLine(camelSnake, v))
    versionLines.splice(-1, 0, getVersionLine(camelSnake, v))
  }

  log('New version writing...')
  writeFileSync(
    indexFilePath,
    [...importLines, '', ...versionLines, '', ...restLines].join('\n')
  )
  log('New version write successful!')
}

const generateAbiVersions = (keys: Keys[]) => {
  if (keys.length <= 0) return
  for (const k of keys) {
    if (k === 'all') continue
    generateAbiVersion(k)
  }
}

const main = async () => {
  const keys = Object.keys(contractConfig) as Keys[]
  const answerKey = await select({
    message: 'Select the contract you want to generate:',
    choices: keys.map((k) => ({ value: k })),
  })

  if (answerKey === 'all') {
    generateAbiVersions(keys)
    return
  }

  generateAbiVersion(answerKey)
}

main()
