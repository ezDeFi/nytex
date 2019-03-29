pragma solidity ^0.5.5;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./../interfaces/OrderbookInterface.sol";

interface ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes calldata _data) external;
}
 
contract ERC223 is ERC20 {

    OrderbookInterface internal orderbook;
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value, bytes _data);

    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint _value, bytes memory _data) public
    returns (bool success) {
        
        if(isContract(_to)) {
            return transferToContract(_to, _value, _data);
        }
        else {
            return transferToAddress(_to, _value, _data);
        }
    }

    //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
    function isContract(address _addr) private returns (bool is_contract) {
        uint length;
        assembly {
                //retrieve the size of the code on target address, this needs assembly
                length := extcodesize(_addr)
        }
        return (length>0);
    }

    // function that is called when transaction target is an address
    function transferToAddress(address _to, uint _value, bytes memory _data) private returns (bool success) {
        _burn(msg.sender, _value);
        _mint(_to, _value);
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    
    // function that is called when transaction target is a contract
    function transferToContract(address _to, uint _value, bytes memory _data) private returns (bool success) {
        _burn(msg.sender, _value);
        _mint(_to, _value);
        ContractReceiver receiver = ContractReceiver(_to);
        receiver.tokenFallback(msg.sender, _value, _data);
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }
}