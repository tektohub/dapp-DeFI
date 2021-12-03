var MasterchefV2 = artifacts.require("./MasterChef/MasterChefV2.sol");

module.exports = function(deployer) {
  deployer.deploy(MasterchefV2);
};
