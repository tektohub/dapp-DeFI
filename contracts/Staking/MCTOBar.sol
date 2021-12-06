// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../MasterChef/MCTO.sol";

// SushiBar is the coolest bar in town. You come in with some Sushi, and leave with more! The longer you stay, the more Sushi you get.
//
// This contract handles swapping to and from xSushi, SushiSwap's staking token.
contract MCTOBar is ERC20("MCTOBar", "stkMCTO"){
    MCTO public sushi;
    uint public lastBlockRewarded;
    uint public MCTOPerBlock = 1000000000000000;
    uint public lastBlockTimestamp;

    // Define the Sushi token contract
    constructor(MCTO _sushi) {
        sushi = _sushi;
        lastBlockRewarded = block.number;
        lastBlockTimestamp = block.timestamp;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    // Locks Sushi and mints xSushi
    function enter(uint256 _amount) public {
        // Gets the amount of Sushi locked in the contract
        uint256 totalSushi = sushi.balanceOf(address(this));
        // Gets the amount of xSushi in existence
        uint256 totalShares = totalSupply();
        // If no xSushi exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSushi == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xSushi the Sushi is worth. The ratio will change overtime, as xSushi is burned/minted and Sushi deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount * totalShares / totalSushi;
            _mint(msg.sender, what);
        }
        // Lock the Sushi in the contract
        sushi.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SUSHIs.
    // Unlocks the staked + gained Sushi and burns xSushi
    function leave(uint256 _share) public {
        // Gets the amount of xSushi in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Sushi the xSushi is worth
        uint256 what = _share * sushi.balanceOf(address(this)) / totalShares;
        _burn(msg.sender, _share);
        sushi.transfer(msg.sender, what);
    }

    function mintReward() public {
        require(block.number > lastBlockRewarded, 'block number lock');
        require(block.timestamp > (lastBlockTimestamp + 5 seconds), 'timestamp lock');
        uint totalBlockToMint = block.number - lastBlockRewarded;
        lastBlockTimestamp = block.timestamp;
        lastBlockRewarded = block.number;
        sushi.mint(address(this), totalBlockToMint * MCTOPerBlock);
    }
}