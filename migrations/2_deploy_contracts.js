var Orderbook = artifacts.require('./Orderbook.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

module.exports = async function(deployer) {
    await deployer.deploy(Orderbook).then(async function() {
        await deployer.deploy(StableToken, await Orderbook.address)
        await deployer.deploy(VolatileToken, await Orderbook.address)
    });
};