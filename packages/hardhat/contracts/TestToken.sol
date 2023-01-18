pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract TestToken is ERC20 {

    constructor () ERC20("testToken", "TEST"){}

    function mint ( uint256 amount ) public { //this for testing only !!
        _mint(msg.sender, amount);
    }

}