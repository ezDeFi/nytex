import TxCodePage from '@/module/page/txcode'
import LoginPage from '@/module/page/login'
import NotFound from '@/module/page/error/NotFound'
import ExchangePage from '@/module/page/exchange'

export default [
  {
    path: '/',
    page: TxCodePage
  },
  {
    path: '/home',
    page: TxCodePage
  },
  {
    path: '/txcode',
    page: TxCodePage
  },
  {
    path: '/login',
    page: LoginPage
  },
  {
    path: '/exchange',
    page: ExchangePage
  },
  {
    page: NotFound
  }
]
