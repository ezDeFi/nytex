var PairEx = artifacts.require('./PairEx.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

const nullAddress = '0x0000000000000000000000000000000000000000'

module.exports = async function(deployer) {
    deployer.deploy(PairEx, nullAddress, nullAddress).then(async function() {
        await deployer.deploy(StableToken, nullAddress)
        await deployer.deploy(VolatileToken, nullAddress)
        let pairExInst = await PairEx.deployed()
        //await console.log('pairExInst', pairExInst)
        await pairExInst.setup(VolatileToken.address, StableToken.address)
    });
};