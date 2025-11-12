// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./UsesGalaxisRegistry.sol";

contract CatSwap is UsesGalaxisRegistry {
    using EnumerableSet for EnumerableSet.UintSet;

    IERC721Enumerable                   public cats;

    

    mapping(uint256 => address)                 tokenOwners;
    EnumerableSet.UintSet                       tokensForSwap;
    EnumerableSet.UintSet                       _tokensWanted;
    mapping(uint256 => EnumerableSet.UintSet)   canSwapFor;
    mapping(uint256 => EnumerableSet.UintSet)   possibleSwaps;


    constructor(address _galaxisRegistry) UsesGalaxisRegistry(_galaxisRegistry) {
        address catsAddress = galaxisRegistry.getRegistryAddress("TOKAIDO_CATS");
        require(catsAddress != address(0),err("TOKAIDO CATS key not set"));
        cats = IERC721Enumerable(galaxisRegistry.getRegistryAddress("TOKAIDO_CATS"));
    }


    function submitForTrade(uint256 tokenId, uint256[] calldata wanted) external {
        require(galaxisRegistry.getRegistryAddress("CAT_SWAP") == address(this),err("not curent CatSwap contract"));
        require(cats.ownerOf(tokenId) == msg.sender, err("you do not own this cat"));
        require(cats.isApprovedForAll(msg.sender,address(this)),err("you need to trust me"));
        tokenOwners[tokenId] = msg.sender;
        for (uint j = 0; j < wanted.length; j++) {
            canSwapFor[wanted[j]].add(tokenId);
            _tokensWanted.add(wanted[j]);
            possibleSwaps[tokenId].add(wanted[j]);
        }
        cats.transferFrom(msg.sender,address(this), tokenId);
        tokensForSwap.add(tokenId);
    }

    function completeTrade(uint256 tokenId, uint256 inExchangeFor) external {
        require(cats.ownerOf(tokenId) == msg.sender, err("you do not own this cat"));
        require(cats.ownerOf(inExchangeFor) == address(this), err("I do not own the required cat"));
        require(cats.isApprovedForAll(msg.sender,address(this)),err("you need to trust me"));
        require(canSwapFor[tokenId].contains(inExchangeFor),err("this swap does not exist"));
        address otherTokenOwner = tokenOwners[inExchangeFor];
        cats.transferFrom(msg.sender,otherTokenOwner,tokenId);
        cats.transferFrom(address(this),msg.sender,inExchangeFor);
        canSwapFor[tokenId].remove(inExchangeFor);
        if (canSwapFor[tokenId].length() == 0) {
            _tokensWanted.remove(tokenId);
        }
        for(uint j = 0; j < possibleSwaps[inExchangeFor].length(); j++) {
            uint ps = possibleSwaps[inExchangeFor].at(j);
            canSwapFor[ps].remove(inExchangeFor);
            if (canSwapFor[ps].length() == 0) {
                _tokensWanted.remove(ps);
            }
        }
        possibleSwaps[inExchangeFor].clear();
        tokenOwners[inExchangeFor] = address(0);
        tokensForSwap.remove(inExchangeFor);
    }

    function withdrawMyToken(uint n) external {
        require(msg.sender == tokenOwners[n],err("not your token"));
        tokensForSwap.remove(n);

        for(uint j = 0; j < possibleSwaps[n].length(); j++) {
            uint ps = possibleSwaps[n].at(j);
            canSwapFor[ps].remove(n);
            if (canSwapFor[ps].length() == 0) {
                _tokensWanted.remove(ps);
            }
        }
        possibleSwaps[n].clear();
        tokenOwners[n] = address(0);
        tokensForSwap.remove(n);
        cats.transferFrom(address(this),msg.sender,n);
    }

    function tokensAvailable() external view returns (uint256[] memory) {
        return tokensForSwap.values();
    }

    function tokensWanted() external view returns (uint256[] memory) {
        return _tokensWanted.values();
    }

    function whatCanIGetFor(uint256 tokenId) external view returns (uint256[] memory) {
        return canSwapFor[tokenId].values();
    }

    function err(string memory errmsg) internal pure returns (string memory) {
        return string.concat("CatSwap : ",errmsg);
    }

}