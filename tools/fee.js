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
    var endPoint = 'http://rpc.testnet.nexty.io:8545'
    networkId = 111111
    break;
  case 'reg':
  default:
    var endPoint = 'http://62.171.189.27:8545'
    networkId = 111111
}

const AccountConfigAddress = '0x2222222222222222222222222222222222222222'

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
  async coinfee() {
    const acc1 = await newAcc(big.decShift(13.6, 18));
    const balance1 = await web3.eth.getBalance(acc1, 'pending');
    const balanceSTB1 = await stb.methods.balanceOf(acc1).call();
    console.log(coinDisplay(balance1), coinDisplay(balanceSTB1));
    const acc2 = await newAcc(0);
    const balance2 = await web3.eth.getBalance(acc2, 'pending');
    console.log(coinDisplay(balance2));
    await web3.eth.sendTransaction({
      from: acc1,
      value: big.decShift(13.6, 18),
      to: acc2,
      gas: 21000,
      gasPrice: 0,
    })//.then(receipt => console.log(receipt.transactionHash));
  },

  async call() {
    const acc1 = await newSTBAcc(big.decShift(6, 18));
    const acc2 = await newSTBAcc(0);
    const acc3 = await newSTBAcc(0);
    let tx

    const params = {
      from: acc1,
      gasPrice: 1000000000000,
    }
    tx = stb.methods.transfer(acc3, big.decShift(1, 18))
    params.gas = await tx.estimateGas(_.clone(params))
    console.log('estimate price', params.gasPrice, '=', params.gas)
    // params.gas = 40000
    // params.gas--
    await tx.call(_.clone(params)).then(console.log)
      .catch(console.error)
    await tx.send(_.clone(params)).then(receipt => {
      console.log(receipt.gasUsed)
      // console.log(JSON.stringify(receipt.events))
    });
    await stb.methods.balanceOf(acc1).call().then(balance => {
      console.log(acc1, 'STB', coinDisplay(balance))
    })
  },

  async callfee() {
    const acc1 = await newSTBAcc(big.decShift(6, 18));
    const acc2 = await newSTBAcc(0);
    const acc3 = await newSTBAcc(0);
    let tx

    const params = {
      from: acc1,
      gasPrice: 123456789,
    }
    tx = stb.methods.transfer(acc3, big.decShift(1, 18))
    params.gas = await tx.estimateGas(_.clone(params))
    console.log('estimate price', params.gasPrice, '=', params.gas)
    // params.gas = 40000
    // params.gas--

    params.to = tx._parent._address
    params.data = tx.encodeABI()

    params.tokenFee = true
    web3.eth.call(params)
      .then(console.log)
      .catch(console.error)
  },

  async tokenfee() {
    const acc1 = await newSTBAcc(big.decShift(6, 18));
    const acc2 = await newSTBAcc(0);
    const acc3 = await newSTBAcc(0);
    let tx
    tx = stb.methods.transfer(acc2, big.decShift(1, 18))
    const gas0 = await tx.estimateGas({
      from: acc1,
      gasPrice: 0,
    })
    console.log('estimate price = 0', gas0)
    await tx.send({
      from: acc1,
      gas: gas0,
      gasPrice: 0,
    }).then(receipt => {
      console.log(receipt.gasUsed)
      // console.log(JSON.stringify(receipt.events))
    });
    await stb.methods.balanceOf(acc1).call().then(balance => {
      console.log(acc1, 'STB', coinDisplay(balance))
    })

    tx = stb.methods.transfer(acc3, big.decShift(1, 18))
    const gas1 = await tx.estimateGas({
      from: acc1,
      gasPrice: 1000000,
    })
    console.log('estimate price = 1', gas1)
    await tx.send({
      from: acc1,
      gas: gas1,
      gasPrice: 1000000000000,
    }).then(receipt => {
      console.log(receipt.gasUsed)
      // console.log(JSON.stringify(receipt.events))
    });
    await stb.methods.balanceOf(acc1).call().then(balance => {
      console.log(acc1, 'STB', coinDisplay(balance))
    })

    // await tx.estimateGas({
    //   from: acc1,
    //   gasPrice: 1,
    // }).then(console.log)
    // await tx.send({
    //   from: acc1,
    //   gas: 70000,
    //   gasPrice: 0,
    // }).then(receipt => {
    //   console.log(receipt.gasUsed)
    //   // console.log(JSON.stringify(receipt.events))
    // });
    // await stb.methods.balanceOf(acc1).call().then(balance => {
    //   console.log(acc1, 'STB', coinDisplay(balance))
    // })
    // const tx3 = stb.methods.transfer(acc3, big.decShift(0.13, 18))
    // await tx.estimateGas({
    //   from: acc1,
    //   gasPrice: 0,
    // }).then(console.log)
    // await tx3.send({
    //   from: acc1,
    //   gas: 70000,
    //   gasPrice: 1,
    // }).then(receipt => {
    //   console.log(receipt.gasUsed)
    //   // console.log(JSON.stringify(receipt.events))
    // });
    // stb.methods.balanceOf(acc1).call().then(balance => {
    //   console.log(acc1, 'STB', coinDisplay(balance))
    // })

    // const balance1 = await web3.eth.getBalance(acc1, 'pending');
    // console.log(coinDisplay(balance1));
    // const acc2 = await newAcc(0);
    // const balance2 = await web3.eth.getBalance(acc2, 'pending');
    // console.log(coinDisplay(balance2));
    // await web3.eth.sendTransaction({
    //   from: acc1,
    //   value: big.decShift(13.6, 18),
    //   to: acc2,
    //   gas: 21000,
    // })//.then(receipt => console.log(receipt.transactionHash));
  },

  async join() {
    const balance = await web3.eth.getBalance(acc, 'pending');
    console.log('balance', coinDisplay(balance))
    const deposited = await gov.methods.getBalance(acc).call()
    console.log('deposited', coinDisplay(deposited))
    const stakeRequire = await gov.methods.stakeRequire().call()
    console.log('require', coinDisplay(stakeRequire))
    const need = BigInt(stakeRequire) - BigInt(deposited)
    console.log('need', coinDisplay(need))
    if (need > 0) {
      /* the new deposit method on receive */
      // await web3.eth.sendTransaction({
      //   from: acc,
      //   value: need.toString(),
      //   to: gov._address,
      //   gas: 100000,
      // }).then(receipt => console.log(receipt.transactionHash))

      /* the legacy deposit method is also valid */
      await gov.methods.deposit().send({
        from: acc,
        value: need.toString(),
        gas: 100000,
      }).then(receipt => console.log(receipt.transactionHash));
    }
    await gov.methods.join('0x101e0fda41aeacc2deec587afa3506819a788667').send({from: acc, gas: 1000000})
      .then(receipt => console.log(receipt.transactionHash))
  },

  async leave() {
    await gov.methods.leave().send({from: acc, gas: 1000000})
      .then(receipt => console.log(receipt.transactionHash))
      .catch(err => console.error(err))
    const deposited = await gov.methods.getBalance(acc).call()
    console.log('deposited', coinDisplay(deposited))
    if (deposited > 0) {
      await gov.methods.withdraw().send({from: acc, gas: 100000})
        .then(receipt => console.log(receipt.transactionHash));
    }
  }
}

function coinDisplay(wei, decimals = 18) {
  return big.thousands(big.decShift(wei, -decimals))
}

actions[action]()