import VolatileToken from './../build/contracts/VolatileToken.json'
import StableToken from './../build/contracts/StableToken.json'
import Seigniorage from './../build/contracts/Seigniorage.json'

const NetId = '111111'
const SeigniorageAddress    = '0x0000000000000000000000000000000000023456'
const VolatileTokenAddress  = '0x0000000000000000000000000000000000034567'
const StableTokenAddress    = '0x0000000000000000000000000000000000045678'
const ConsensusDeploy = true

export const USER_ROLE = {
  MEMBER: 'MEMBER',
  LEADER: 'LEADER',
  ADMIN: 'ADMIN',
  COUNCIL: 'COUNCIL'
}

export const CONTRACTS = {
  'VolatileToken':
    {
     'abi': VolatileToken.abi,
     'address': ConsensusDeploy ? VolatileTokenAddress : VolatileToken.networks[NetId].address
   },
  'StableToken':
   {
     'abi': StableToken.abi,
     'address': ConsensusDeploy ? StableTokenAddress : StableToken.networks[NetId].address
   },
  'Seigniorage':
   {
     'abi': Seigniorage.abi,
     'address': ConsensusDeploy ? SeigniorageAddress : Seigniorage.networks[NetId].address
   },
}

export const USER_LANGUAGE = {
  en: 'en'
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
