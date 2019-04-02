import * as _ from 'lodash'

const create = (list) => {
    return _.zipObject(list, list)
}

export const NETWORK_ID = '111111'

export const USER_ROLE = {
    MEMBER : 'MEMBER',
    LEADER : 'LEADER',
    ADMIN : 'ADMIN',
    COUNCIL: 'COUNCIL'
}

export const ETHERS_SCAN = 'https://etherscan.io/tx/' // production
// export const ETHERS_SCAN = 'https://rinkeby.etherscan.io/tx/' // test
export const WEB_URL = 'http://192.168.187.159:8001'

export const USER_LANGUAGE = {
    en: 'en',
    zh: 'zh'
}

export const REWARD_TYPE = {
    NORMAL: 'NORMAL',
    ROUND: 'ROUND',
    JACPOT: 'JACKPOT'
}

export const USER_GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
}

export const TASK_CATEGORY = {
    DEVELOPER: 'DEVELOPER',
    SOCIAL: 'SOCIAL',
    LEADER: 'LEADER',
    CR100: 'CR100'
}

export const TASK_TYPE = {
    TASK: 'TASK',
    SUB_TASK: 'SUB_TASK',
    PROJECT: 'PROJECT',
    EVENT: 'EVENT'
}

export const TASK_EVENT_DATE_TYPE = {
    NOT_APPLICABLE: 'NOT_APPLICABLE',
    TENTATIVE: 'TENTATIVE',
    CONFIRMED: 'CONFIRMED'
}

export const TASK_STATUS = {
    // PROPOSAL: 'PROPOSAL',

    CREATED: 'CREATED', // if no ELA
    PENDING: 'PENDING', // if ELA > 0

    APPROVED: 'APPROVED', // Approved by admin

    ASSIGNED: 'ASSIGNED', // when max candidates are accepted or auto assigned

    // in between ASSIGNED and SUBMITTED, individual task candidates
    // can mark their completion which is recorded in the array candidateCompleted
    // this is only for reference, the task is not fully completed until the owner

    // owner acknowledges task is done - by enough parties (note it does not have to be all)
    SUBMITTED: 'SUBMITTED',

    SUCCESS: 'SUCCESS', // when admin accepts it as complete
    DISTRIBUTED: 'DISTRIBUTED', // when admin distributes ELA rewards
    CANCELED: 'CANCELED',

    // TODO: application deadline passed without any applicants
    EXPIRED: 'EXPIRED'
}

export const TASK_CANDIDATE_TYPE = {
    USER: 'USER',
    TEAM: 'TEAM'
}

export const TASK_CANDIDATE_CATEGORY = {
    RSVP: 'RSVP'
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

export const CONTRIB_CATEGORY = {
    BLOG: 'BLOG',
    VIDEO: 'VIDEO',
    PODCAST: 'PODCAST',
    OTHER: 'OTHER'
}

export const DEFAULT_IMAGE = {
    TASK: '/assets/images/task_thumbs/12.jpg',
    UNSET_LEADER: '/assets/images/User_Avatar_Other.png'
}

export const SUBMISSION_TYPE = {
    BUG: 'BUG',
    SECURITY_ISSUE: 'SECURITY_ISSUE',
    SUGGESTION: 'SUGGESTION',
    ADD_COMMUNITY: 'ADD_COMMUNITY',
    OTHER: 'OTHER',
    FORM_EXT: 'FORM_EXT',
    EMPOWER_35: 'EMPOWER_35'
}

export const SUBMISSION_CAMPAIGN = {
    COMMUNITY_ORGANIZER: 'COMMUNITY_ORGANIZER',
    ANNI_2008: 'ANNI_2008',
    ANNI_VIDEO_2008: 'ANNI_VIDEO_2008',
    EMPOWER_35: 'EMPOWER_35'
}

export const SKILLSET_TYPE = create(['CPP', 'JAVASCRIPT', 'GO', 'PYTHON', 'JAVA', 'SWIFT'])
// Images
export const USER_AVATAR_DEFAULT = '/assets/images/User_Avatar_Male.png'

export const CVOTE_STATUS = create(['DRAFT', 'PROPOSED', 'ACTIVE', 'REJECT', 'FINAL', 'DEFERRED'])

export const USER_SKILLSET = {
    DESIGN: create(['LOGO_DESIGN', 'FLYERS', 'PACKAGING', 'ILLUSTRATION', 'INFOGRAPHIC', 'PRODUCT_DESIGN',
        'MERCHANDISE', 'PHOTOSHOP']),
    MARKETING: create(['SOCIAL_MEDIA_MARKETING', 'SEO', 'CONTENT_MARKETING', 'VIDEO_MARKETING',
        'EMAIL_MARKETING', 'MARKETING_STRATEGY', 'WEB_ANALYTICS', 'ECOMMERCE', 'MOBILE_ADVERTISING']),
    WRITING: create(['TRANSLATION', 'PRODUCT_DESCRIPTIONS', 'WEBSITE_CONTENT', 'TECHNICAL_WRITING',
        'PROOFREADING', 'CREATIVE_WRITING', 'ARTICLES_WRITING', 'SALES_COPY', 'PRESS_RELEASES',
        'LEGAL_WRITING']),
    VIDEO: create(['INTROS', 'LOGO_ANIMATION', 'PROMO_VIDEOS', 'VIDEO_ADS', 'VIDEO_EDITING',
        'VIDEO_MODELING', 'PRODUCT_PHOTO']),
    MUSIC: create(['VOICE_OVER', 'MIXING', 'MUSIC_PRODUCTION']),
    DEVELOPER: {
        ...SKILLSET_TYPE,
        ...create(['SOFTWARE_TESTING'])
    },
    BUSINESS: create(['VIRTUAL_ASSISTANT', 'DATA_ENTRY', 'MARKET_RESEARCH', 'BUSINESS_PLANS',
        'LEGAL_CONSULTING', 'FINANCIAL_CONSULTING', 'PRESENTATION'])
}

// export const WS_PROVIDER = 'wss://rinkeby.infura.io/ws'
// export const WS_PROVIDER = 'wss://rinkeby.infura.io/ws/v3/4cad92309e07403c89ea1982cfbe78be'
export const HTTP_PROVIDER = 'https://mainnet.infura.io/v3/f2ffee3e3500452fad9b02f935fe0032'
export const WS_PROVIDER = 'wss://mainnet.infura.io/ws/v3/f2ffee3e3500452fad9b02f935fe0032'
export const EVENT = {
    DepositSuccess: 'DepositSuccess',
    RewardRoundWinner: 'RewardRoundWinner',
    RewardJackpotWinner: 'RewardJackpotWinner'
}
export const AMOUNT_DEFAULT = 0.01
export const TOKEN_ADDRESS = '0x46a19d32be761efcab0bef87c92ab3911f3fab86'
export const ADDRESS0X0 = '0x0000000000000000000000000000000000000000'
// export const TOKEN_ADDRESS = '0x636d24009827962f2b4ece901fcf9916f90d9076' //Test
export const ABI_TOKEN_ERC20 = [
    {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "maxRandom",
        "outputs": [
            {
                "name": "number",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "setIntervalJackpotTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "setIntervalTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "setMinAmountDeposit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "countRound",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "countJackpot",
                "type": "uint256"
            }
        ],
        "name": "DepositSuccess",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "wallet1",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount1",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "wallet2",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount2",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "wallet3",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount3",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "rewardRank",
                "type": "uint256"
            }
        ],
        "name": "RewardRoundWinner",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "wallet1",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount1",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "wallet2",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount2",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "wallet3",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount3",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "rewardRank",
                "type": "uint256"
            }
        ],
        "name": "RewardJackpotWinner",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "amountJackpot",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "amountRound",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "countJackpot",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "countPlayerJackpot",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "countPlayerRound",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "countRound",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "DEPOSIT_AMOUNT",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "INTERVAL_TIME",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "JACKPOT_INTERVAL_TIME",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "jackpotTime",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PERCENT_REWARD_TO_JACKPOT",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PERCENT_REWARD_TOP_RANK",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PERCENT_REWARD_TOP1",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PERCENT_REWARD_TOP2",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "PERCENT_REWARD_TOP3",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "players",
        "outputs": [
            {
                "name": "wallet",
                "type": "address"
            },
            {
                "name": "playing",
                "type": "bool"
            },
            {
                "name": "playingJackpot",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "roundTime",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winner1",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winner2",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winner3",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerAmount1",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerAmount2",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerAmount3",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpot1",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpot2",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpot3",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpotAmount1",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpotAmount2",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "winnerJackpotAmount3",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
