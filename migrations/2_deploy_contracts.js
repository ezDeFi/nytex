var ReadWrite = artifacts.require("./ReadWrite.sol");

module.exports = function(deployer) {
  deployer.deploy(ReadWrite);
  // deployer.deploy(Seigniorage);
};