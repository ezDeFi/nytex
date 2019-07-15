import SeignioragePage from '@/module/page/seigniorage/Container'

import LoginPage from '@/module/page/login/Container'

import NotFound from '@/module/page/error/NotFound'

export default [
  {
    path: '/',
    page: LoginPage
  },
  {
    path: '/home',
    page: SeignioragePage
  },
  {
    path: '/login',
    page: LoginPage
  },
  {
    page: NotFound
  }
]
