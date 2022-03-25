pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
//import '@openzeppelin/contracts/utils/Counters.sol';
import './IToken.sol';

contract BridgeMain {
  IToken public token;
  
  mapping(bytes32 => bool) public completed;
  address private _validator;
  mapping(address => string) public tokens;
  mapping(uint => string) public chains;
  //using Counters for Counters.Counter;  
  //Counters.Counter private nonce;

  event Transfer(
    address from,
    address to,
    uint amount,
    uint date,
    uint nonce,
    uint chainFrom,
    uint chainTo
  );

  constructor(address _token) {
    token = IToken(_token);
    
  }

  function setToken(address addr) public{
    require(keccak256(abi.encodePacked(tokens[addr])) != keccak256(abi.encodePacked("")), "doesn't exist");
    token = IToken(addr);
  }

  function setValidator(address addr) public{
    _validator = addr;
  }

  function includeToken(address addr, string memory name) public{
    require(keccak256(abi.encodePacked(tokens[addr])) != keccak256(abi.encodePacked("")), "already exist");
    tokens[addr] = name;
  }
  function excludeToken(address addr) public{
    tokens[addr] = "";
  }

  function updateChainById(address addr) public{
  }

  /*function getNewNonce() private returns(uint){
    nonce.increment();
    return nonce.current();
  }
  */


  function swap(address to, uint256 amount, uint chainFrom, uint chainTo, uint nonce) public {
    bytes32 message = keccak256(abi.encodePacked(
      to, 
      amount,
      nonce,
      chainFrom,
      chainTo
    ));
    
    require(completed[message] == false, 'transfer already processed');
    completed[message] = true;
    token.burn(msg.sender, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      chainFrom,
      chainTo
    );
  }

  function redeem(address from, address to, uint256 amount, uint nonce, bytes32 r, bytes32 s, uint8 v) external {
    bytes32 message = prefixed(keccak256(abi.encodePacked(
      from,
      to, 
      amount,
      nonce
    )));
    require(ecrecover(message, v, r, s) == _validator, "wrong signature");
    require(completed[message] == false, 'transfer already processed');
    completed[message] = true;
    token.mint(to, amount);
  }

  function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(
      '\x19Ethereum Signed Message:\n32', 
      hash
    ));
  }
}