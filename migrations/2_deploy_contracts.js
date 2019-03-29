var Orderbook = artifacts.require('./Orderbook.sol');
var NUSD = artifacts.require('./tokens/NUSD.sol');
var WNTY = artifacts.require('./tokens/WNTY.sol');

module.exports = async function(deployer) {
    await deployer.deploy(Orderbook).then(async function() {
        await deployer.deploy(NUSD, await Orderbook.address)
        await deployer.deploy(WNTY, await Orderbook.address)
    });
};