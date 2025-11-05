// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Cats is ERC721Enumerable {

    constructor() ERC721("CATS","CATS") {}

    uint256 next = 1;

    function mint(uint256 n) external {
        for (uint j = 0; j < n; j++) {
            _mint(msg.sender,(next++));
        }
    }
}