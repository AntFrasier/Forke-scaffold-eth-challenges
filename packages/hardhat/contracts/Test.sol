pragma solidity >=0.8.0 <0.9.0;

contract Test {

    string public theString;
    uint256 public theUint256;
    uint64 public theUint64;
    bool public theBool;
    int32 public theInt32;
    bytes public theBytes;
    bytes32 public theBytes32;
    uint256[] theUint256Array;

    function storeString(string memory a) external {
        theString = a;
    }
    function storeUint256(uint256  a) external {
        theUint256 = a;
    }
    function storeUint64(uint64 a) external {
        theUint64 = a;
    }
    function storeBool(bool a) external {
        theBool = a;
    }
    function storeInt32(int32 a) external {
        theInt32 = a;
    }
    function storeBytes(bytes memory a) external {
        theBytes = a;
    }
    function storeBytes32(bytes32 a) external {
        theBytes32 = a;
    }
    function storeUintArray(uint256[] memory a) external {
        theUint256Array = a;
    }




}