import HomePage from '@/module/page/home/Container'
import BankPage from '@/module/page/bank/Container'
import LeaderboardPage from '@/module/page/leaderboard/Container'
import CoinFlipPage from '@/module/page/coinflip/Container'
import SocialPage from '@/module/page/social/Container'

import PrivacyPage from '@/module/page/static/privacy/Container'
import TermsPage from '@/module/page/static/terms/Container'

import LoginPage from '@/module/page/login/Container'
import RegisterPage from '@/module/page/register/Container'
import ForgotPasswordPage from '@/module/page/forgot_password/Container'
import ResetPasswordPage from '@/module/page/reset_password/Container'

import HelpPage from '@/module/page/static/help/Container'
import AboutPage from '@/module/page/static/about/Container'

import ProfileInfoPage from '@/module/page/profile/info/Container'
import ProfileDepositPage from '@/module/page/profile/deposit/Container'
import ProfileRewardPage from '@/module/page/profile/reward/Container'
import ProfileTransactionPage from '@/module/page/profile/transaction/Container'

import MemberPage from '@/module/page/member/Container'

import AdminUsersPage from '@/module/page/admin/users/Container'
import AdminProfileDetailPage from '@/module/page/admin/profile_detail/Container'
import AdminDepositsPage from '@/module/page/admin/deposits/Container'
import AdminRewardsPage from '@/module/page/admin/rewards/Container'
import AdminRefersPage from '@/module/page/admin/refers/Container'
import AdminLeaderBoardPage from '@/module/page/admin/leaderboard/Container'
import AdminTransactionPage from '@/module/page/admin/transaction/Container'
import AdminTransactionDetailPage from '@/module/page/admin/transaction_detail/Container'

// DApps
import DappSimpleDicePage from '@/module/page/dapps/simpleDice/Container'
import DappOrderbookPage from '@/module/page/dapps/orderbook/Container'

import NotFound from '@/module/page/error/NotFound'

export default [
    {
        path: '/',
        page: DappOrderbookPage
    },
    {
        path: '/leaderboard',
        page: LeaderboardPage
    },
     {
        path: '/coin-flip',
        page: CoinFlipPage
    },
    {
        path: '/social',
        page: SocialPage
    },
    /*
    ********************************************************************************
    * Login/Register
    ********************************************************************************
      */
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/register',
        page: RegisterPage
    },
    {
        path: '/forgot-password',
        page: ForgotPasswordPage
    },
    {
        path: '/reset-password',
        page: ResetPasswordPage
    },
    /*
    ********************************************************************************
    * Minor Pages
    ********************************************************************************
      */
    {
        path: '/help',
        page: HelpPage
    },
    {
        path: '/about',
        page: AboutPage
    },
    /*
    ********************************************************************************
    * Profile page
    ********************************************************************************
      */
    {
        path: '/profile/info',
        page: ProfileInfoPage
    },
    {
        path: '/profile/deposit',
        page: ProfileDepositPage
    },
    {
        path: '/profile/reward',
        page: ProfileRewardPage
    },
    {
        path: '/profile/transaction',
        page: ProfileTransactionPage
    },
    /*
    ********************************************************************************
    * Users
    ********************************************************************************
      */
    {
        // public profile page
        path: '/member/:userId',
        page: MemberPage
    },
    {
        path: '/bank',
        page: BankPage
    },
    /*
    ********************************************************************************
    * Admin
    ********************************************************************************
      */
    {
        path: '/admin/users',
        page: AdminUsersPage
    },
    {
        path: '/admin/deposits',
        page: AdminDepositsPage
    },
    {
        path: '/admin/rewards',
        page: AdminRewardsPage
    },
    {
        path: '/admin/refers',
        page: AdminRefersPage
    },
    {
        path: '/admin/profile/:userId',
        page: AdminProfileDetailPage
    },
    {
        path: '/admin/leaderboard',
        page: AdminLeaderBoardPage
    },
    {
        path: '/admin/transaction',
        page: AdminTransactionPage
    },
    {
        path: '/admin/transaction/:transactionId',
        page: AdminTransactionDetailPage
    },

    // DApps
    {
        path: '/dapps/simpledice',
        page: DappSimpleDicePage
    },
    {
        path: '/dapps/orderbook',
        page: DappOrderbookPage
    },

    // Other
    {
        page: NotFound
    }
]
