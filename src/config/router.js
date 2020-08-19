import SeignioragePage from '@/module/page/seigniorage/Container'
import PreemptivePage from '@/module/page/preemptive/Container'
import TxCodePage from '@/module/page/txcode/Container'
import ConfigPage from '@/module/page/config/Container'
import GovPage from '@/module/page/gov/Container'
import LoginPage from '@/module/page/login/Container'
import NotFound from '@/module/page/error/NotFound'

export default [
  {
    path: '/',
    page: SeignioragePage
  },
  {
    path: '/home',
    page: SeignioragePage
  },
  {
    path: '/exchange',
    page: SeignioragePage
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
    path: '/config',
    page: ConfigPage
  },
  {
    path: '/gov',
    page: GovPage
  },
  {
    path: '/login',
    page: LoginPage
  },
  {
    page: NotFound
  }
]
