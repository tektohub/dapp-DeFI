// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MCTO is ERC20("Mamie Crypto", "MCTO"), Ownable {

    mapping(address => bool) public admin;

    modifier onlyAdmin() {
        require(owner() == _msgSender() || admin[msg.sender]);
        _;
    }

    function mint(address _to, uint256 _amount) public onlyAdmin {
        _mint(_to, _amount);
    }

    function setAdmin(address _newAdmin) public onlyOwner {
        require (admin[_newAdmin] == false);
        admin[_newAdmin] = true;
    }

    function removeAdmin(address _newAdmin) public onlyOwner {
        require (admin[_newAdmin] == true);
        admin[_newAdmin] = false;
    }
}
