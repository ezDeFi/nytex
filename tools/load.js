const VolatileTokenData = require('./../build/contracts/VolatileToken.json')
const StableTokenData = require('./../build/contracts/StableToken.json')
const SeigniorageData = require('./../build/contracts/Seigniorage.json')
const Web3 = require('web3');
const Tx = require('ethereumjs-tx')
var BigNumber = require('bignumber.js')

let args = process.argv
let network = args[2]
let spamType = args[3]
if (!spamType) spamType = 'both'
let noo = args[4]
if (!noo) noo = 30
let endPoint = network.includes('local') ? 'http://127.0.0.1:8545' : 'http://rpc.testnet.nexty.io:8545'
const networkId = 111111
const SeigniorageAddress    = '0x0000000000000000000000000000000000123456'
const VolatileTokenAddress  = '0x0000000000000000000000000000000001234567'
const StableTokenAddress    = '0x0000000000000000000000000000000012345678'
const ConsensusDeploy = process.env.CONDEP

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
        'address': ConsensusDeploy ? VolatileTokenAddress : VolatileTokenData.networks[networkId].address
      },
    'StableToken':
      {
        'abi': StableTokenData.abi,
        'address': ConsensusDeploy ? StableTokenAddress : StableTokenData.networks[networkId].address
      },
    'Seigniorage':
      {
        'abi': SeigniorageData.abi,
        'address': ConsensusDeploy ? SeigniorageAddress : SeigniorageData.networks[networkId].address
      }
  }

var web3 = new Web3(new Web3.providers.HttpProvider(endPoint))
var VolatileToken = new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address)
var StableToken = new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address)
var myAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d';
var privateKey = Buffer.from('a0cf475a29e527dcb1c35f66f1d78852b14d5f5109f75fa4b38fbe46db2022a5', 'hex')

var myBalance

async function getNonce (_address) {
  return await web3.eth.getTransactionCount(_address)
}

async function trade (nonce, orderType) {
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
    'data': methodsHave.trade(amountHave, amountWant, [0]).encodeABI(),
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
  await trade(nonce, orderType)
}

async function spam () {
  let count = await getNonce(myAddress)
  await console.log('start with nonce = ', count)
  let methods = VolatileToken.methods
  myBalance = await methods.balanceOf(myAddress).call()
  await console.log('start with WNTY Amount = ', BigNumber(myBalance).toFixed(0))
  for (let i = 0; i < noo; i++) {
    randomOrder(count + i)
  }
}

spam()