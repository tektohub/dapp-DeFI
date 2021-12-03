// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fUSDC is ERC20 {
    constructor(uint256 initialSupply) ERC20("fUSDC", "fUSDC") {
        _mint(msg.sender, initialSupply);
    }
}
