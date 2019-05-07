var PairEx = artifacts.require('./PairEx.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

module.exports = async function(deployer) {
    deployer.deploy(PairEx).then(async function() {
        await deployer.deploy(StableToken)
        await deployer.deploy(VolatileToken)
        let pairExInst = await PairEx.deployed()
        await console.log('pairExInst', pairExInst)
        // if deployed by core(bytecode copied), ignore next line and manuell call after that
        await pairExInst.setup(VolatileToken.address, StableToken.address)
    });
};