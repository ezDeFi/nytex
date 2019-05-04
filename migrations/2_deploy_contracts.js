var PairEx = artifacts.require('./PairEx.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

const nullAddress = '0x0000000000000000000000000000000000000000'
module.exports = async function(deployer) {
    await deployer.deploy(PairEx, nullAddress, nullAddress).then(async function() {
        await deployer.deploy(StableToken, await PairEx.address)
        await deployer.deploy(VolatileToken, await PairEx.address)
    });
};