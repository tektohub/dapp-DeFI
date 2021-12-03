var Masterchef = artifacts.require("./MasterChef/MasterChef.sol");
var MCTOToken = artifacts.require("./MasterChef/MCTO.sol");

module.exports = function(deployer) {
  deployer.deploy(MCTOToken).then( (instance) => deployer.deploy(Masterchef,
    instance.address, 0, 10, 0, 1000));
};
