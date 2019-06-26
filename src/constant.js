import VolatileToken from './../build/contracts/VolatileToken.json'
import StableToken from './../build/contracts/StableToken.json'
import PairEx from './../build/contracts/PairEx.json'

const NetId = '111111'
const PairExAddress = '0x0000000000000000000000000000000000123456'
const VolatileTokenAddress = '0x0000000000000000000000000000000001234567'
const StableTokenAddress = '0x0000000000000000000000000000000012345678'

export const USER_ROLE = {
  MEMBER: 'MEMBER',
  LEADER: 'LEADER',
  ADMIN: 'ADMIN',
  COUNCIL: 'COUNCIL'
}

export const DECIMALS = {
  mnty: 24,
  nusd: 6
}

export const CONTRACTS =
  {
    'VolatileToken':
      {
        'abi': VolatileToken.abi,
        'address': VolatileTokenAddress
      },
    'StableToken':
      {
        'abi': StableToken.abi,
        'address': StableTokenAddress
      },
    'PairEx':
      {
        'abi': PairEx.abi,
        'address': PairExAddress
      },
  }

export const WEB3 = {
  //HTTP: 'http://108.61.148.72:8545', // testnet
  HTTP: 'http://45.32.103.64:8545', // devnet
  // HTTP: 'http://13.228.68.50:8545', // mainnet
  // HTTP: 'http://localhost:8545', // localhost
  NETWORK_ID: NetId // testnet
}

// To change WEB3 ABI ADDRESS

export const USER_LANGUAGE = {
  en: 'en',
  zh: 'zh'
}

export const TEAM_ROLE = {
  MEMBER: 'MEMBER',
  OWNER: 'OWNER'
}

export const TASK_CATEGORY = {
  DEVELOPER: 'DEVELOPER',
  SOCIAL: 'SOCIAL',
  LEADER: 'LEADER'
}

export const TASK_TYPE = {
  TASK: 'TASK',
  SUB_TASK: 'SUB_TASK',
  PROJECT: 'PROJECT',
  EVENT: 'EVENT'
}

export const TASK_STATUS = {
  PROPOSAL: 'PROPOSAL',
  CREATED: 'CREATED',
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
}

export const TASK_CANDIDATE_TYPE = {
  USER: 'USER',
  TEAM: 'TEAM'
}

export const TASK_CANDIDATE_STATUS = {
  // NOT_REQUIRED: 'NOT_REQUIRED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}

export const COMMUNITY_TYPE = {
  COUNTRY: 'COUNTRY',
  STATE: 'STATE',
  CITY: 'CITY',
  REGION: 'REGION',
  SCHOOL: 'SCHOOL'
}

export const TRANS_STATUS = {
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export const ISSUE_CATEGORY = {
  BUG: 'BUG',
  SECURITY: 'SECURITY',
  SUGGESTION: 'SUGGESTION',
  OTHER: 'OTHER'
}

export const CONTRIB_CATEGORY = {
  BLOG: 'BLOG',
  VIDEO: 'VIDEO',
  PODCAST: 'PODCAST',
  OTHER: 'OTHER'
}

export const DEFAULT_IMAGE = {
  TASK: '/assets/images/task_thumbs/12.jpg'
}

export const MIN_VALUE_DEPOSIT = 500000
