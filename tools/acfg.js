const ERC20Data = require('../abi/ERC20.json')
const big = require('../lib/big.js')
const Web3 = require('web3');
const _ = require('lodash');
// const { CONFIG_FILENAME } = require('tslint/lib/configuration');

const args = process.argv
const action = args[2]
const network = args[3]
switch (network) {
  case 'local':
    var endPoint = 'http://localhost:8545'
    networkId = 111111
    break;
  case 'prod':
    var endPoint = 'https://rpc.nexty.io'
    networkId = 66666
    break;
  case 'dev':
  default:
    var endPoint = 'http://rpc.testnet.nexty.io:8545'
    networkId = 111111
}

const STBAddress = '0x0000000000000000000000000000000000045678'

const CONTRACTS =
  {
    'STB':
      {
        'abi': ERC20Data.abi,
        'address': STBAddress,
      },
  }

const web3 = new Web3(new Web3.providers.HttpProvider(endPoint))
const stb = new web3.eth.Contract(CONTRACTS.STB.abi, CONTRACTS.STB.address)

const keys = {
  '0xd638dc353687169d117df1933ba93fcc1ff42834': '4c668fce6f03044f74ccd256b837a485a809562a55947abdfcb934d8cf8fe631',
  '0x71e2ecb267a79fa7d026559aba3a10ee569f4176': '0f2e668a2374c2e19e55520ce65a5f95b3597fd08013fd35bc2de23a917d2ba0',
  '0x1367fc3b5c3ce52d61347c0fe2216e576cb2060e': 'bf4fac22ace8a92ee9d66913ed7358729d939cd3681bd7c43526cd4f036e2525',
}
// const acc = '0x1367fc3b5c3ce52d61347c0fe2216e576cb2060e'
// const key = 'bf4fac22ace8a92ee9d66913ed7358729d939cd3681bd7c43526cd4f036e2525'

// const account = web3.eth.accounts.privateKeyToAccount('0x' + key);
// web3.eth.accounts.wallet.add(account);
// web3.eth.defaultAccount = account.address;

{
  const account = web3.eth.accounts.privateKeyToAccount('0x4c668fce6f03044f74ccd256b837a485a809562a55947abdfcb934d8cf8fe631');
  web3.eth.accounts.wallet.add(account);
  var accETH = account.address;
  // const balance = await web3.eth.getBalance(acc, 'pending');
  // console.log(coinDisplay(balance));
}

{
  const account = web3.eth.accounts.privateKeyToAccount('0xbf4fac22ace8a92ee9d66913ed7358729d939cd3681bd7c43526cd4f036e2525');
  web3.eth.accounts.wallet.add(account);
  var accSTB = account.address;
  stb.methods.balanceOf(accSTB).call().then(balance =>
    console.log('Fund: ', accSTB, 'STB', coinDisplay(balance)))
}

 
async function newAcc(amount) {
  const account = web3.eth.accounts.create('riddle');
  web3.eth.accounts.wallet.add(account);
  // console.log(account.address);
  if (amount > 0) {
    await web3.eth.sendTransaction({
      from: accETH,
      value: amount.toString(),
      to: account.address,
      gas: 21000,
    })//.then(receipt => console.log(receipt.transactionHash));
  }
  return account.address;
}

async function newSTBAcc(amount) {
  const account = web3.eth.accounts.create('riddle');
  web3.eth.accounts.wallet.add(account);
  // console.log(account.address);
  if (amount > 0) {
    await stb.methods.transfer(account.address, amount.toString()).send({
      from: accSTB,
      gas: 72000,
    })//.then(receipt => console.log(receipt.transactionHash));
    const balance = await stb.methods.balanceOf(account.address).call()
    console.log(account.address, 'STB', coinDisplay(balance))
  }
  return account.address;
}

const actions =  {
  async config() {
    const acc1 = await newAcc(big.decShift(13.6, 18));
    const balance1 = await web3.eth.getBalance(acc1, 'pending');
    const balanceSTB1 = await stb.methods.balanceOf(acc1).call();
    console.log(coinDisplay(balance1), coinDisplay(balanceSTB1));
    let tx
    tx = {
      from: acc1,
      value: 0,
      to: '0x2222222222222222222222222222222222222222',
      data: '0x22222222222222222222222222222222222222222222222222222222222222220123456789012345678901234567890123456789012345678901234567890123',
      gasPrice: 1,
    }
    tx.gas = await web3.eth.estimateGas(_.clone(tx));
    console.log('gas estimated', tx.gas)
    await web3.eth.call(_.clone(tx), 'pending').then(console.log).catch(console.error)
    await web3.eth.sendTransaction(tx).then(receipt => console.log(receipt.transactionHash)).catch(console.error)

    tx = {
      from: acc1,
      value: 0,
      to: '0x2222222222222222222222222222222222222222',
      data: '0x2222222222222222222222222222222222222222222222222222222222222222',
      gasPrice: 1,
    }
    tx.gas = await web3.eth.estimateGas(_.clone(tx));
    console.log('gas estimated', tx.gas)
    await web3.eth.call(_.clone(tx), 'pending').then(console.log).catch(console.error)

    tx = {
      from: acc1,
      value: 0,
      to: '0x2222222222222222222222222222222222222222',
      data: '0x22222222222222222222222222222222222222222222222222222222222222220000000000000000000000000000000000000000000000000000000000000000',
      gasPrice: 1,
    }
    tx.gas = await web3.eth.estimateGas(_.clone(tx));
    console.log('gas estimated', tx.gas)
    await web3.eth.call(_.clone(tx), 'pending').then(console.log).catch(console.error)
    await web3.eth.sendTransaction(tx).then(receipt => console.log(receipt.transactionHash)).catch(console.error)

    tx = {
      from: acc1,
      value: 0,
      to: '0x2222222222222222222222222222222222222222',
      data: '0x2222222222222222222222222222222222222222222222222222222222222222',
      gasPrice: 1,
    }
    tx.gas = await web3.eth.estimateGas(_.clone(tx));
    console.log('gas estimated', tx.gas)
    await web3.eth.call(_.clone(tx), 'pending').then(console.log).catch(console.error)
  }
}

function coinDisplay(wei, decimals = 18) {
  return big.thousands(big.decShift(wei, -decimals))
}

actions[action]()