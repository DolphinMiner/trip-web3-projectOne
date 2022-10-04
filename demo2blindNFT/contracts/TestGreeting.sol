// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TestGreeting {
    string greeting = "Welcome to web 3.0.";

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string calldata _newGreeting) public {
        greeting = _newGreeting;
    }
}
