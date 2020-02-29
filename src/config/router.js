import HomePage from '@/module/page/home/Container'
import SeignioragePage from '@/module/page/seigniorage/Container'
import PreemptivePage from '@/module/page/preemptive/Container'
import TxCodePage from '@/module/page/txcode/Container'
import LoginPage from '@/module/page/login/Container'
import NotFound from '@/module/page/error/NotFound'
import exchange from '@/module/page/exchange/Container'

export default [
  {
    path: '/',
    page: SeignioragePage
  },
  {
    path: '/home',
    page: HomePage
  },
  {
    path: '/exchange',
    page: SeignioragePage
  },
  {
    path: '/homeee',
    page: exchange
  },
  {
    path: '/preemptive',
    page: PreemptivePage
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
    page: NotFound
  }
]
