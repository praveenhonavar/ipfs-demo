// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17 <=0.8.3;

contract SimpleStorage {
  string storedData;

  function set(string memory x) public {
    storedData = x;
  }

  function get() public view returns (string memory) {
    
    return storedData;
  }
}
