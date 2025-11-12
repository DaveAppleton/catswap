pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

contract TheRegistry is AccessControlEnumerable  {

    bytes32             public constant REGISTRY_ADMIN_ROLE = keccak256("REGISTRY_ADMIN");
    mapping(bytes32 => address)         addresses;
    mapping(bytes32 => uint256)         uints;
    mapping(bytes32 => bool)            booleans;
    mapping(bytes32 => string)          strings;

    mapping (uint => string)    public  addressEntries;
    mapping (uint => string)    public  uintEntries;
    mapping (uint => string)    public  boolEntries;
    mapping (uint => string)    public  stringEntries;
    uint                        public  numberOfAddresses;
    uint                        public  numberOfUINTs;
    uint                        public  numberOfBooleans;
    uint                        public  numberOfStrings;

    uint                        public  nextAdmin;
    mapping(address => bool)    public  adminHas;
    mapping(uint256 => address) public  adminEntries;
    mapping(address => uint256) public  appAdminCounter;
    mapping(address =>mapping(uint256 =>address)) public appAdminEntries;


    event AdminUpdated(address user, bool isAdmin);
    event AppAdminChanged(address app,address user,bool state);
    //===
    event AddressChanged(string key, address value);
    event UintChanged(string key, uint256 value);
    event BooleanChanged(string key, bool value);
    event StringChanged(string key, string value);


    constructor() {
        _grantRole(REGISTRY_ADMIN_ROLE,msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE,msg.sender);
    }

    function setAdmin(address user,bool status ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (status) {
            _grantRole(REGISTRY_ADMIN_ROLE,user);
        } else {
            _revokeRole(REGISTRY_ADMIN_ROLE,user);
        }
    }

    function isAdmin(address user) external view returns (bool) {
        return hasRole(REGISTRY_ADMIN_ROLE,user);
    }

    function hash(string memory field) internal pure returns (bytes32) {
        return keccak256(abi.encode(field));
    }

    function setRegistryAddress(string memory fn, address value) external onlyRole(REGISTRY_ADMIN_ROLE) {
        bytes32 hf = hash(fn);
        addresses[hf] = value;
        addressEntries[numberOfAddresses++] = fn;
        emit AddressChanged(fn,value);
    }

    function setRegistryBool(string memory fn, bool value) external onlyRole(REGISTRY_ADMIN_ROLE) {
        bytes32 hf = hash(fn);
        booleans[hf] = value;
        boolEntries[numberOfBooleans++] = fn;
        emit BooleanChanged(fn,value);
    }

    function setRegistryString(string memory fn, string memory value) external onlyRole(REGISTRY_ADMIN_ROLE) {
        bytes32 hf = hash(fn);
        strings[hf] = value;
        stringEntries[numberOfStrings++] = fn;
        emit StringChanged(fn,value);
    }

    function setRegistryUINT(string memory fn, uint value) external onlyRole(REGISTRY_ADMIN_ROLE) {
        bytes32 hf = hash(fn);
        uints[hf] = value;
        uintEntries[numberOfUINTs++] = fn;
        emit UintChanged(fn,value);
    }

    function getRegistryAddress(string memory key) external view returns (address) {
        return addresses[hash(key)];
    }

    function getRegistryBool(string memory key) external view returns (bool) {
        return booleans[hash(key)];
    }

    function getRegistryUINT(string memory key) external view returns (uint256) {
        return uints[hash(key)];
    }

    function getRegistryString(string memory key) external view returns (string memory) {
        return strings[hash(key)];
    }

    
}