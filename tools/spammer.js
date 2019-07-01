const VolatileTokenData = require('./../build/contracts/VolatileToken.json')
const StableTokenData = require('./../build/contracts/StableToken.json')
const PairExData = require('./../build/contracts/PairEx.json')
const Web3 = require('web3');
const Tx = require('ethereumjs-tx')
var BigNumber = require('bignumber.js')

let args = process.argv
let network = args[2]
let spamType = args[3]
if (!spamType) spamType = 'both'
let noo = args[4]
if (!noo) noo = 30
let endPoint = network.includes('local') ? 'http://127.0.0.1:8545' : 'http://108.61.148.72:8545'
const networkId = 111111
const PairExAddress = '0x0000000000000000000000000000000000123456'
const VolatileTokenAddress = '0x0000000000000000000000000000000001234567'
const StableTokenAddress = '0x0000000000000000000000000000000012345678'

let seed = 1

async function cutString (s) {
  if (!s) return s
  if (s.length < 20) return s
  var first5 = s.substring(0, 5).toLowerCase()
  var last3 = s.slice(-3)
  return first5 + '...' + last3
}

async function weiToMNTY (wei) {
  return await (Number(web3.utils.fromWei(wei.toString())) / 1000000).toFixed(4)
}

const DECIMALS = {
  mnty: 24,
  nusd: 6
}

const UNITS =
{
  'MNTY': BigNumber(10).pow(DECIMALS.mnty),
  'NUSD': BigNumber(10).pow(DECIMALS.nusd)
}

const AMOUNT_MAX_DIGIT = 36;

const CONTRACTS =
  {
    'VolatileToken':
      {
        'abi': VolatileTokenData.abi,
        'address': VolatileTokenAddress
      },
    'StableToken':
      {
        'abi': StableTokenData.abi,
        'address': StableTokenAddress
      },
    'PairEx':
      {
        'abi': PairExData.abi,
        'address': PairExAddress
      }
  }

var web3 = new Web3(new Web3.providers.HttpProvider(endPoint))
var VolatileToken = new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address)
var StableToken = new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address)
var PairEx = new web3.eth.Contract(CONTRACTS.PairEx.abi, CONTRACTS.PairEx.address)
var myAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d';
var privateKey = Buffer.from('a0cf475a29e527dcb1c35f66f1d78852b14d5f5109f75fa4b38fbe46db2022a5', 'hex')

var myBalance

async function getNonce (_address) {
  return await web3.eth.getTransactionCount(_address)
}

async function simpleBuy (nonce, orderType) {
  console.log('new order', orderType)
  const contractAddress = orderType === 'sell' ? VolatileToken._address : StableToken._address
  const methodsHave = orderType === 'sell' ? VolatileToken.methods : StableToken.methods

  // adjust _wantAmount to the demand/supply
  const methodsWant = orderType !== 'sell' ? VolatileToken.methods : StableToken.methods
  //let supplyHave = await methodsHave.totalSupply().call();
  const balanceHave = await methodsHave.balanceOf(myAddress).call();
  const supplyWant = await methodsWant.totalSupply().call();
  const wiggle = Math.random() * 0.003 + (orderType === 'sell' ? 0.9999 : 0.9998) ;
  let amountHave = Math.floor(balanceHave / 2 / noo);
  let amountWant = Math.floor(supplyWant / 2 / noo * wiggle)
    .toLocaleString('fullwide', {useGrouping:false});

  let have = amountHave.toString();
  let want = amountWant.toString();
  if (have.length > AMOUNT_MAX_DIGIT || want.length > AMOUNT_MAX_DIGIT) {
    let toShift = Math.max(have.length, want.length) - AMOUNT_MAX_DIGIT;
    console.log('have', have, 'want', want, 'toShift', toShift);
    if (have.length > toShift) {
      have = have.substr(0, have.length-toShift);
    } else {
      have = '1';
    }
    if (want.length > toShift) {
      want = want.substr(0, want.length-toShift);
    } else {
      want = '1';
    }
  }
  amountHave = parseInt(have).toLocaleString('fullwide', {useGrouping:false});
  amountWant = parseInt(want).toLocaleString('fullwide', {useGrouping:false});

  const price = orderType === 'sell' ?
    (amountWant / amountHave / 1e18) :
    (1e18 * amountHave / amountWant);
  console.log('PRICE', price, 'wiggle', wiggle, 'have', amountHave, 'want', amountWant);

  let rawTransaction = {
    'from': myAddress,
    'gasPrice': web3.utils.toHex(0),
    'gasLimit': web3.utils.toHex(9999999),
    'to': contractAddress,
    'value': web3.utils.toHex(0),
    'data': methodsHave.simpleBuy(amountHave, amountWant, [0]).encodeABI(),
    'nonce': web3.utils.toHex(nonce)
  }
  //console.log(rawTransaction)
  let transaction = new Tx(rawTransaction);
  // signing transaction with private key
  transaction.sign(privateKey)
  // sending transacton via web3 module
  await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex')) // .on('transactionHash', console.log)
}

async function randomOrder (nonce) {
  let orderType
  if (spamType.toLowerCase() === 'buy') {
    orderType = 'buy'
  } else if (spamType.toLowerCase() === 'sell') {
    orderType = 'sell'
  } else {
    orderType = (Math.random() < 0.5) ? 'sell' : 'buy'
  }
  await simpleBuy(nonce, orderType)
}

async function getOrder(orderType, id) {
  // const store = this.store.getState()
  let methods = PairEx.methods
  let res = await methods.getOrder(orderType, id).call()
  let weiMNTY = orderType ? BigNumber(await res[2]) : BigNumber(await res[1])
  weiMNTY = weiMNTY.toFixed(0)
  // console.log('weiMNTY', weiMNTY)
  let weiNUSD = orderType ? BigNumber(await res[1]) : BigNumber(await res[2])
  weiNUSD = weiNUSD.toFixed(0)
  let amount = weiToMNTY(await weiMNTY)
  // let price = NUSDs / 1 MNTY = (weiNUSD / 1e18) / (weiMNTY / 1e24) = 1e6 * weiNUSD / weiMNTY
  let wPrice = BigNumber(await weiNUSD).multipliedBy(BigNumber(10).pow(DECIMALS.mnty)).div(await weiMNTY).div(BigNumber(10).pow(DECIMALS.nusd)) // weiNUSD / 1 MNTY
  // let expo = BigNumber(10).pow(DECIMALS.nusd)
  // let _before = BigNumber(wPrice).div(expo)
  // let _after = BigNumber(wPrice).mod(expo)
  // let price = _before.toString() + '.' + _after.toString()
  let price = wPrice.toFixed(10)
  let order = await {
      'id': id,
      'maker': cutString(res[0]),
      'amount': amount,
      'price' : price,
      'haveAmount': res[1],
      'wantAmount': res[2],
      'prev': res[3],
      'next': res[4]}
  return await order
}

async function loadOrders(orderType) {
  //const pairExRedux = this.store.getRedux('pairEx')
  let orders = []
  let byteZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
  let id = byteZero
  let order = await getOrder(orderType, id)
  let prev = await order.prev
  let loop = 10
  while ((await prev !== byteZero)) {
      // await console.log('orderId', _id, 'prev', prev)
      id = await prev
      order = await getOrder(orderType, id)
      //await this.addOrderToRedux(_orderType, order)
      await orders.push(order)
      prev = await order.prev
      await loop--
  }
  //await console.log('order' + _orderType ? 'Buy' : 'Sell', orders)
  if (orderType) orders = await orders.reverse()
  console.log(await orderType ? 'Buy' : 'Sell')
  console.log('length ', orders.length)
  //orders.push(orders[0])
  //let sortedOrders = await orders.sort((a, b) => (Number(a.price) > Number(b.price)) ? 1 : ((Number(b.price) > Number(a.price)) ? -1 : 0))
  // console.log('order 0', orders[0])
  // console.log('order 1', orders[1])
  for (let i = 0; i < orders.length - 1; i++) {
    if (Number(orders[i].price) < Number(orders[i + 1].price)) {
      console.log('ERROR at ', i)
      console.log(orders[i - 1])
      console.log(orders[i])
      console.log(orders[i + 1])
      return false
    }
  }
  console.log('PAST')
  return true
  // if ((await orders) !== (await sortedOrders)) {
  //   await console.log('ERROR')
  // } else {
  //   await console.log('CORRECT')
  // }
  // if (_orderType) {
  //     await this.dispatch(pairExRedux.actions.orders_update({'true': orders.reverse()}))
  // } else {
  //     await this.dispatch(pairExRedux.actions.orders_update({'false': orders}))
  // }
}

async function spam () {
  let count = await getNonce(myAddress)
  await console.log('start with nonce = ', count)
  let methods = VolatileToken.methods
  myBalance = await methods.balanceOf(myAddress).call()
  await console.log('start with WNTY Amount = ', BigNumber(myBalance).toFixed(0))
  for (let i = 0; i < noo; i++) {
    randomOrder(count + i)
    // let test = await loadOrders(false)
    // if (!test) return
    // test = await loadOrders(true)
    // if (!test) return
  }
  let test = await loadOrders(false)
  if (!test) return
  test = await loadOrders(true)
  if (!test) return
}

seed = 6688
spam()
//console.log(sinRandom())
// ERROR CASE
// new order Buy 90955684 88306489700594284400000000
// { id:
//   '0x22ceefdd9f2865d3fbf02cc67f592cd59f978879f152e0fed45eb3a7ca214a02',
//  maker: Promise { '0x95e...85d' },
//  amount: Promise { '88.3065' },
//  price: '1.0299999956',
//  haveAmount: '90955684',
//  wantAmount: '88306489700594284400000000',
//  prev:
//   '0x009638faa2c890252f9f7796fe04784f54fc525043474ea71e074c526ba1c41a',
//  next:
//   '0x77f0cbf7f61ff048c7e8920487465e2a167eea6975ed35a81d2b36c64d5be88c' }
