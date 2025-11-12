// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "./IRegistry.sol";

contract UsesGalaxisRegistry {

    IRegistry   immutable   public   galaxisRegistry;

    constructor(address _galaxisRegistry) {
        galaxisRegistry = IRegistry(_galaxisRegistry);
    }

}