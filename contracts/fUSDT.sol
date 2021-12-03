// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract fUSDT is ERC20 {
    constructor(uint256 initialSupply) ERC20("fUSDT", "fUSDT") {
        _mint(msg.sender, initialSupply);
    }
}
