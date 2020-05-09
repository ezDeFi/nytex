import TxCodePage from '@/module/page/txcode'
import LoginPage from '@/module/page/login'
import NotFound from '@/module/page/error/NotFound'
import ExchangePage from '@/module/page/exchange'
import Preemptive from '@/module/page/preemptive'

export default [
  {
    path: '/',
    page: ExchangePage
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
    path: '/preemptive',
    page: Preemptive
  },
  {
    page: NotFound
  }
]
