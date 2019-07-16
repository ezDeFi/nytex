var Seigniorage = artifacts.require('./Seigniorage.sol');
var StableToken = artifacts.require('./tokens/StableToken.sol');
var VolatileToken = artifacts.require('./tokens/VolatileToken.sol');

const nullAddress = '0x0000000000000000000000000000000000000000'
const truffleAddress = '0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d'

module.exports = async function(deployer) {
    deployer.deploy(Seigniorage, 13, 26, 6, 52).then(async function() {
        await deployer.deploy(VolatileToken, Seigniorage.address, truffleAddress, 1000).then(async function() {
            await deployer.deploy(StableToken, Seigniorage.address, truffleAddress, 1000).then(async function() {
                let seigniorageInst = await Seigniorage.deployed()
                //await console.log('seigniorageInst', seigniorageInst)
                await seigniorageInst.registerTokens(VolatileToken.address, StableToken.address)
            })
        })
    });
};