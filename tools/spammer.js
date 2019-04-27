const VolatileTokenData = require('./../build/contracts/VolatileToken.json')
const StableTokenData = require('./../build/contracts/StableToken.json')
const Web3 = require('web3');
const Tx = require('ethereumjs-tx')
var BigNumber = require('bignumber.js');

let args = process.argv
let network = args[2]
let endPoint = network.includes('local') ? 'http://127.0.0.1:8545' : 'http://108.61.148.72:8545'
const networkId = 111111

const CONTRACTS =
  {
    'VolatileToken':
      {
        'abi': VolatileTokenData.abi,
        'address': VolatileTokenData.networks[networkId].address
      },
    'StableToken':
      {
        'abi': StableTokenData.abi,
        'address': StableTokenData.networks[networkId].address
      }
  }

const UNITS =
  {
    'MNTY': BigNumber(10).pow(24),
    'NUSD': BigNumber(10).pow(18)
  }

const BOUNDS =
{
  'Sell':
    {
      // WNTY Amount
      'Amount': {
        'Min': BigNumber(1).multipliedBy(UNITS.MNTY),
        'Max': BigNumber(10).multipliedBy(UNITS.MNTY)
      },
      // NUSD / 1 WNTY
      'Price': {
        'Min': BigNumber(11).multipliedBy(UNITS.NUSD).dividedBy(UNITS.MNTY),
        'Max': BigNumber(20).multipliedBy(UNITS.NUSD).dividedBy(UNITS.MNTY)
      }
    },
  'Buy':
    {
      // WNTY Amount
      'Amount': {
        'Min': BigNumber(1).multipliedBy(UNITS.MNTY),
        'Max': BigNumber(10).multipliedBy(UNITS.MNTY)
      },
      // NUSD / 1 WNTY
      'Price': {
        'Min': BigNumber(1).multipliedBy(UNITS.NUSD).dividedBy(UNITS.MNTY),
        'Max': BigNumber(10).multipliedBy(UNITS.NUSD).dividedBy(UNITS.MNTY)
      }
    }
}

var web3 = new Web3(new Web3.providers.HttpProvider(endPoint))
var VolatileToken = new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address)
var StableToken = new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address)
var myAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d';
var privateKey = Buffer.from('a0cf475a29e527dcb1c35f66f1d78852b14d5f5109f75fa4b38fbe46db2022a5', 'hex')

var count
var myBalance

async function getNonce (_address) {
  return await web3.eth.getTransactionCount(_address)
}

async function simpleBuy (nonce, _orderType, _haveAmount, _wantAmount) {
  console.log('new order', _orderType, _haveAmount, _wantAmount)
  let contractAddress = _orderType === 'Sell' ? VolatileToken._address : StableToken._address
  let methods = _orderType === 'Sell' ? VolatileToken.methods : StableToken.methods
  let toDeposit
  toDeposit = 0
  if (_orderType === 'Sell') {
    toDeposit = BigNumber(myBalance).isGreaterThan(BigNumber(_haveAmount)) ? 0 : BigNumber(_haveAmount).minus(BigNumber(myBalance))
    toDeposit = new BigNumber(toDeposit).toFixed(0)
  }
  if (BigNumber(toDeposit).isGreaterThan(0)) myBalance = 0
  console.log('current balance xxx', myBalance, 'toDeposit', toDeposit)
  let rawTransaction = {
    'from': myAddress,
    'gasPrice': web3.utils.toHex(1e9),
    'gasLimit': web3.utils.toHex(780000),
    'to': contractAddress,
    'value': web3.utils.toHex(toDeposit),
    'data': methods.simpleBuy(_haveAmount, _wantAmount, [0]).encodeABI(),
    'nonce': web3.utils.toHex(nonce)
  }
  console.log(rawTransaction)
  let transaction = new Tx(rawTransaction);
  // signing transaction with private key
  transaction.sign(privateKey)
  // sending transacton via web3 module
  await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex')) // .on('transactionHash', console.log)
}

// return random integer number in range [MIN, MAX]
function randomGen (_min, _max) {
  let zoom = new BigNumber(10).pow(18)
  let min = new BigNumber(_min).multipliedBy(zoom)
  let max = new BigNumber(_max).multipliedBy(zoom)
  let range = new BigNumber(max).minus(BigNumber(min))
  let random = new BigNumber(Math.random()).multipliedBy(range)
  let res = ((BigNumber(min).plus(random)).dividedBy(zoom))
  return res
}

function getZoom (_value) {
  let parts = _value.toString().split('.')
  if (parts.length < 2) return 1
  return 10 ** (parts[1].length)
}

function getMaxZoom (a, b) {
  return a > b ? a : b
}

function createRandomOrderByType (_orderType) {
  let minPrice = BOUNDS[_orderType].Price.Min
  let maxPrice = BOUNDS[_orderType].Price.Max
  console.log('minPrice', minPrice)
  console.log('maxPrice', maxPrice)
  let price = randomGen(maxPrice, minPrice)
  console.log('price', price)
  let minAmount = BOUNDS[_orderType].Amount.Min
  let maxAmount = BOUNDS[_orderType].Amount.Max
  let haveAmount
  let wantAmount
  if (_orderType === 'Sell') {
    haveAmount = new BigNumber(randomGen(maxAmount, minAmount)).toFixed(0)
    wantAmount = new BigNumber(haveAmount).multipliedBy(BigNumber(price)).toFixed(0)
  } else {
    wantAmount = new BigNumber(randomGen(maxAmount, minAmount)).toFixed(0)
    haveAmount = new BigNumber(wantAmount).multipliedBy(BigNumber(price)).toFixed(0)
  }
  let order = {
    'orderType': _orderType,
    'haveAmount': haveAmount,
    'wantAmount': wantAmount
  }
  return order
}

function createRandomOrder () {
  let _seed = randomGen(1, 0)
  let _orderType = BigNumber(_seed).isGreaterThan(BigNumber(0.5)) ? 'Sell' : 'Buy'
  return createRandomOrderByType(_orderType)
}

async function randomOrder (nonce) {
  let order = createRandomOrder()
  await simpleBuy(nonce, order.orderType, order.haveAmount, order.wantAmount)
}

async function spam () {
  let count = await getNonce(myAddress)
  await console.log('start with nonce = ', count)
  let methods = VolatileToken.methods
  myBalance = await methods.balanceOf(myAddress).call()
  await console.log('start with WNTY Amount = ', BigNumber(myBalance).toFixed(0))
  for (let i = 0; i <= 10; i++) {
    await randomOrder(count + i)
  }
}

spam()
