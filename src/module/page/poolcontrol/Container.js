import { createContainer } from '@/util'
import Component from './Component'
// import NTFToken from '@/service/NTFToken'
import NtfTokenService from '@/service/contracts/NtfTokenService'
import NtfPoolService from '@/service/contracts/NtfPoolService'
import UserService from '@/service/UserService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const ntfTokenService = new NtfTokenService()
  const ntfPoolService = new NtfPoolService()

  async function loadOnInit () {
    ntfPoolService.loadLockDuration()
    ntfPoolService.loadMaxLockDuration()
    ntfPoolService.loadOwnerDelay()
    load()
  }

  async function load () {
    userService.loadBlockNumber()

    ntfPoolService.loadPoolAddress()
    ntfPoolService.loadOwner()
    ntfPoolService.loadFund()
    ntfPoolService.loadPoolNtfBalance()
    ntfPoolService.loadPoolNtyBalance()

    ntfPoolService.loadPoolIsWithdrawable()
    ntfPoolService.loadPoolUnlockHeight()
    ntfPoolService.loadPoolDeposited()
    ntfPoolService.loadPoolStatus()
    ntfPoolService.loadPoolSigner()
  }

  if (state.user.wallet !== curWallet && !curWallet) {
    curWallet = state.user.wallet
    loadOnInit()
    setInterval(() => {
      load()
    }, 5000)
  }

  return {
    address: state.pool.address,
    owner: state.pool.owner,
    ownerBalance: state.pool.ownerBalance,
    fund: state.pool.fund,
    poolNtfBalance: state.pool.poolNtfBalance,
    poolNtyBalance: state.pool.poolNtyBalance,
    poolStatus: state.pool.status,
    signer: state.pool.signer,
    unlockHeight: state.pool.unlockHeight,
    blockNumber: state.user.blockNumber,
    lockDuration: state.pool.lockDuration,
    maxLockDuration: state.pool.maxLockDuration,
    ownerDelay: state.pool.ownerDelay,
    stakeRequire: state.pool.stakeRequire
  }
}, () => {
  const userService = new UserService()
  const ntfTokenService = new NtfTokenService()
  const ntfPoolService = new NtfPoolService()

  return {
    async virtuellMining () {
      await ntfPoolService.virtuellMining()
    },
    async claimFund () {
      await ntfPoolService.claimFund()
    },
    async joinGov (_signer) {
      await ntfPoolService.joinGov(_signer)
    },
    async leaveGov () {
      await ntfPoolService.leaveGov()
    },
    async tokenPoolWithdraw () {
      await ntfPoolService.tokenPoolWithdraw()
    },
    async setLockDuration (_lockDuration) {
      await ntfPoolService.setLockDuration(_lockDuration)
    }
  }
})
