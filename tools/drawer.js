const simpleDiceData =require( '../build/contracts/SimpleDice.json')
console.log(simpleDiceData)
const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');

const app = express();
const networkId = 111111

//Infura HttpProvider Endpoint
var web3js = new web3(new web3.providers.HttpProvider('http://108.61.148.72:8545'))

// app.get('/sendtx',function(req,res){

var myAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d';
var privateKey = Buffer.from('A0CF475A29E527DCB1C35F66F1D78852B14D5F5109F75FA4B38FBE46DB2022A5', 'hex')

// contract abi is the array that you can get from the ethereum wallet or etherscan
var contractABI = simpleDiceData.abi;
var contractAddress = simpleDiceData.networks[networkId].address
console.log('abi=', contractABI)
console.log('address=', contractAddress)
// creating contract object
var contract = new web3js.eth.Contract(contractABI,contractAddress);

var count;
// get transaction count, later will used as nonce

async function getNonce(_address) {
    return await web3js.eth.getTransactionCount(_address)
}

async function getBlockNr() {
    return await web3js.eth.getBlockNumber()
}

async function finalize() {
    count = await getNonce(myAddress);
    // creating raw tranaction
    var rawTransaction = {"from":myAddress, "gasPrice":web3js.utils.toHex(10* 1e9),"gasLimit":web3js.utils.toHex(7800000),"to":contractAddress,"value":"0x0","data":contract.methods.endRound().encodeABI(),"nonce":web3js.utils.toHex(await count)}
    console.log(rawTransaction);
    // creating tranaction via ethereumjs-tx
    var transaction = new Tx(rawTransaction);
    // signing transaction with private key
    transaction.sign(privateKey);
    // sending transacton via web3js module
    web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex')).on('transactionHash',console.log);
}

async function getKeyBlock() {
    return await contract.methods.keyBlock().call()
}

async function test() {
    await console.log('keyBlock = ', await getKeyBlock())
}

var lastCalledBlock = 0
var blockDist
var toLastCallDist
var timeDist
var keyBlock
var curBlock
var BLOCK_TIME = 2
setInterval(async () => {
    keyBlock = await getKeyBlock()
    curBlock = await getBlockNr()
    blockDist = keyBlock - curBlock
    toLastCallDist = curBlock - lastCalledBlock
    timeDist = blockDist * BLOCK_TIME
    await console.log('lastCalledBlock', lastCalledBlock)
    await console.log('curBlock = ', curBlock)
    await console.log('keyBlock = ', keyBlock)
    await console.log('distance : ', blockDist, ' blocks', timeDist, 'seconds')
    if ((blockDist < -3) && (toLastCallDist > 8)) {
        lastCalledBlock = curBlock
        await console.log('sent finalize tx at block', curBlock)
        finalize()
    }
}, BLOCK_TIME * 1000)
