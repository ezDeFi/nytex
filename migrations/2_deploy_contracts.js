var PairEx = artifacts.require('./PairEx.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

const nullAddress = '0x0000000000000000000000000000000000000000'
const truffleAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d'

module.exports = async function(deployer) {
    deployer.deploy(PairEx, nullAddress, nullAddress).then(async function() {
        await deployer.deploy(VolatileToken, PairEx.address, truffleAddress, 1000).then(async function() {
            await deployer.deploy(StableToken, PairEx.address, truffleAddress, 1000).then(async function() {
                let pairExInst = await PairEx.deployed()
                //await console.log('pairExInst', pairExInst)
                await pairExInst.registerTokens(VolatileToken.address, StableToken.address)
            })
        })
    });
};