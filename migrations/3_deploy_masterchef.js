var Masterchef = artifacts.require("./MasterChef/MasterChef.sol");
var MCTOToken = artifacts.require("./MasterChef/MCTO.sol");

module.exports = function(deployer) {
  deployer.deploy(MCTOToken).then( (instance) => deployer.deploy(Masterchef,
    instance.address, '0xd26c2c8195e1ecb22Fd9a3227A98de3e31cE943a', 10, 0, 1000));
};
