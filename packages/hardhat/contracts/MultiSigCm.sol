//SPDX-License-Identifier: MIT
//Cyril Maranber 11 2022 Scaffold eth multisig challenge
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MultiSigCm is Ownable {
    using ECDSA for bytes32;

    address public self;
    uint8 public signRequired = 1;
    address[] members;
    enum Role {
        NULL,
        ADMIN,
        OFFICER,
        USER
    }
    struct Params {
        bytes callData;
        address to;
        uint256 amount;
        uint8 signRequired;
        uint256 txId;
    }

    mapping(address => Role) membersRoles;
    //should have a mapping with txId and bool to say this tx as allredy be done to avoid double send the tx
    mapping(uint256 => bool) txSent; //when a txId is receive this mapping is set to true

    event NewSignerEvent(address signer, Role role);
    event RemovedSignerEvent(address signer);
    event SigneRequiredEvent(uint8 signerRequired);
    event TxSent(address to, uint256 value, bytes callData);

    modifier onlySelf() {
        require(msg.sender == self, "not self");
        _;
    }

    constructor() {
        self = address(this);
        members.push(0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B);
        membersRoles[0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B] = Role.ADMIN;
    }

    function isValidSignature(bytes32 _hash, bytes memory signature)
        internal view
        returns (bool)
    {
        address signer = _hash.toEthSignedMessageHash().recover(signature);
        // sender = signer;
        for (uint8 i = 0; i < members.length; i++) {
            if (members[i] == signer) {
                return true;
            }
        }
        return false;
    }

    function getHash(
        bytes memory _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId
    ) public pure returns (bytes32 _hash) {
        // function getHash(uint8 _functionCalled, uint8 _signRequired) public pure returns (bytes32 _hash) {
        Params memory data;
        data.callData = _callData;
        data.to = _to;
        data.amount = _amount;
        data.signRequired = _signRequired;
        data.txId = _txId;
        return (keccak256(abi.encode(data)));
    }

    function execute(
        bytes calldata _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId,
        bytes[] memory signatures
    ) external returns (bytes memory results){
        require(signatures.length >= signRequired, "not enough signaures !");
        require(txSent[_txId] == false, "transaction allready sent ! ");
        Params memory data;
        data.callData = _callData;
        data.to = _to;
        data.amount = _amount;
        data.signRequired = _signRequired;
        data.txId = _txId;
        bytes32 msgHash = keccak256(abi.encode(data));
        uint8 validSignature = 0;
        for (uint8 i = 0; i < signatures.length; i++) {
            if (isValidSignature(msgHash, signatures[i])) {
                validSignature++;
                if (validSignature == signRequired) {
                    break;
                } //gas saving
            }
        }
        require(validSignature >= signRequired, "not enough valide signatures !");
        txSent[_txId] = true; //to avoid to sent the same tx multiple times
        (bool s, bytes memory result) = _to.call{value :_amount}(_callData);
        require (s, "call tx Failed");
        emit TxSent(_to, _amount, _callData);
        return result;
    }

    function addSigner(address _newSigner) public onlySelf {
        members.push(_newSigner);
        membersRoles[_newSigner] = Role.ADMIN;
        emit NewSignerEvent(_newSigner, membersRoles[_newSigner]);
    }

    function removeSigner(address _Signer) public onlySelf {
        bool done = false;
        uint8 index;
        for (uint8 i = 0; i < members.length; i++) {
            if (members[i] == _Signer) {
                index = i;
                done = true;
            }
        }
        require(done, "Signer not fund");
        require(members.length > 1, "Last signer can't be removed !");
        for (uint256 i = index; i < members.length - 1; i++) {
            // shifting the element in the array from index to the last
            members[i] = members[i + 1];
        }
        members.pop(); //remove the last entry of the array
        if (signRequired > members.length && signRequired > 1) {
            signRequired--;
        } //should maybe use a require statement to be sure that there will never be more signature needed that members ??...
        emit RemovedSignerEvent(_Signer);
    }

    function setSignersRequired(uint8 _signRequired) public onlySelf {
        require(_signRequired <= members.length, "Can't have more signers than members");
        signRequired = _signRequired;
        emit SigneRequiredEvent(signRequired);
    }

    function getSigners() public view returns (address[] memory) {
        return members;
    }

    function getMemberRole(address member) public view returns (Role) {
        return membersRoles[member];
    }
    receive()external payable {}

    fallback() external payable {}
}
