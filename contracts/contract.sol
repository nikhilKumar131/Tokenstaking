// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract ercC is ERC20{

    constructor() ERC20("NIK","NIKS"){
        _mint(address(this),1000000000000000000);
    }



    //staked struct and mapping to every account
    struct Staked {
        uint256 _amount;
        uint256 _TimeSinceRewarded;
        uint256 _reward;
    }

    mapping( address => Staked) public individual;

    //NOTICE: THIS FUNCTION IS PUBLIC FOR TESTING PURPOSE, OTHERWISE IT WOULD BE INTERNAL
    function mintToken(address _addr, uint _amount) public {
        _mint(_addr,_amount);
    }

    //update reward and update info
    function stakeToken(uint _amt) public {
        require(balanceOf(msg.sender)>_amt,"your balance is not enough");
        transfer(address(this), _amt);
        uint old_amount = individual[msg.sender]._amount;
        uint new_reward = calculatedReward();
        individual[msg.sender] = Staked(_amt + old_amount, block.timestamp,new_reward);
    }

    //update reward and update info
    function unStakeToken(uint _amt) public{
        uint old_amount = individual[msg.sender]._amount;
        require(old_amount >= _amt,"not enough tokens to staked");
        _transfer(address(this),msg.sender,_amt);
        uint new_reward = calculatedReward();
        individual[msg.sender] = Staked(old_amount - _amt, block.timestamp, new_reward);
    }

    //calculating reward
    function calculatedReward() public view returns(uint) {
        uint amt = individual[msg.sender]._amount;
        uint time = individual[msg.sender]._TimeSinceRewarded;
        uint old_reward = individual[msg.sender]._reward;
        uint totalTime = block.timestamp - time;
        uint _reward = totalTime*amt/1000 + old_reward;

        return _reward;
    }

    //receiving reward
    function receiveReward() public {
        uint new_reward = calculatedReward();
        mintToken(msg.sender,new_reward);
        uint old_amount = individual[msg.sender]._amount;
        individual[msg.sender] = Staked(old_amount, block.timestamp,0);
    }

     receive() payable external {}
     fallback() payable external {}

}

//0x7C53360A37EA3C883E8BCfeBB6da35A35091AA87


