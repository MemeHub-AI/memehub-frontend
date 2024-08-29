export enum Routes {
  Main = '/',

  NotFound = '/404',
  NotFoundEmpty = '/404?t=empty',

  TokenPage = '/[chain]/[address]',

  Create = '/create',

  Airdrop = '/airdrop',

  Alliance = '/alliance',

  Account = '/account',

  Reward = '/reward',

  News = '/news',
  NewsMoonshot = '/news/tab/1',
  NewsClassicMeme = '/news/tab/2',

  Ido = '/ido',

  Notification = '/notification',

  MemexIdea = '/idea',

  MemexLatest = '/idea/latest',
  MemexHots = '/idea/hots',
  MemexMyInvolved = '/idea/my-involved',
  MemexMyIdea = '/idea/my-idea',
  MemexSuccessed = '/idea/successed',

  MemexCreate = '/idea/create',
  MemexCreateDetails = '/idea/create/details',
}
