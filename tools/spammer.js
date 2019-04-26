const VolatileTokenData = require('./../build/contracts/VolatileToken.json')
const StableTokenData = require('./../build/contracts/StableToken.json')
const Web3 = require('web3');
const Tx = require('ethereumjs-tx')

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

const BOUNDS =
{
  'Sell':
    {
      'Amount': {
        'Min': 1,
        'Max': 10 ** 18
      },
      'Price': {
        'Min': 1.144444444444,
        'Max': 10
      }
    },
  'Buy':
    {
      'Amount': {
        'Min': 1,
        'Max': 10 ** 18
      },
      'Price': {
        'Min': 1.144444444444,
        'Max': 10
      }
    },
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
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
    toDeposit = myBalance >= _haveAmount ? 0 : _haveAmount - myBalance
  }
  if (toDeposit > 0) myBalance = 0
  await console.log('current balance', myBalance, 'toDeposit', toDeposit)
  let rawTransaction = {
    'from': myAddress,
    'gasPrice': web3.utils.toHex(1e9),
    'gasLimit': web3.utils.toHex(780000),
    'to': contractAddress,
    'value': web3.utils.toHex(toDeposit.toString()),
    'data': methods.simpleBuy(_haveAmount.toString(), _wantAmount.toString(), [0]).encodeABI(),
    'nonce': web3.utils.toHex(nonce)
  }
  let transaction = new Tx(rawTransaction);
  // signing transaction with private key
  transaction.sign(privateKey)
  // sending transacton via web3 module
  await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex')).on('transactionHash', console.log)
}

// return random integer number in range [MIN, MAX]
function randomGen (MAX, MIN) {
  return MIN + Math.floor(Math.random() * (MAX - MIN + 1))
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
  let zoom = getMaxZoom(getZoom(minPrice), getZoom(maxPrice))
  // console.log('zoom', zoom)
  minPrice = Math.floor(minPrice * zoom)
  maxPrice = Math.floor(maxPrice * zoom)
  // console.log(min, max)
  let price = randomGen(maxPrice, minPrice) / zoom
  // console.log(price)

  let minAmount = BOUNDS[_orderType].Amount.Min
  let maxAmount = BOUNDS[_orderType].Amount.Max
  let haveAmount
  let wantAmount
  if (_orderType === 'Sell') {
    haveAmount = randomGen(maxAmount, minAmount)
    wantAmount = Math.floor(haveAmount * price)
  } else {
    haveAmount = randomGen(maxAmount, minAmount)
    wantAmount = Math.floor(haveAmount / price)
  }
  let order = {
    'orderType' : _orderType,
    'haveAmount': haveAmount,
    'wantAmount': wantAmount
  }
  return order
}

function createRandomOrder () {
  let _seed = randomGen(1, 0)
  let _orderType = _seed === 0 ? 'Sell' : 'Buy'
  return createRandomOrderByType(_orderType)
}

async function randomOrder (nonce) {
  let order = createRandomOrder()
  await simpleBuy(nonce, order.orderType, order.haveAmount, order.wantAmount)
}

async function spam () {
  count = await getNonce(myAddress)
  await console.log('start with nonce = ', count)
  let methods = VolatileToken.methods
  myBalance = await methods.balanceOf(myAddress).call()
  await console.log('start with WNTY Amount = ', myBalance / 1e10)
  for (let i = 0; i <= 100; i++) {
    await randomOrder(count + i)
  }
}

spam()
