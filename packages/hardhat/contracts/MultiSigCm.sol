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
    address[] menbers;
    enum Role {
        NULL,
        ADMIN,
        OFFICER,
        USER
    }
    address public sender;
    struct Params {
        bytes callData;
        address to;
        uint256 amount;
        uint8 signRequired;
        uint256 txId;
    }

    mapping(address => Role) menbersRoles;
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
        menbers.push(0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B);
    }

    function isValidSignature(bytes32 _hash, bytes memory signature)
        internal view
        returns (bool)
    {
        address signer = _hash.toEthSignedMessageHash().recover(signature);
        // sender = signer;
        for (uint8 i = 0; i < menbers.length; i++) {
            if (menbers[i] == signer) {
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

    function addSigner(address _newSigner) internal onlySelf {
        require(menbersRoles[_newSigner] == Role.NULL, "Signer allReady In");
        menbers.push(_newSigner);
        menbersRoles[_newSigner] = Role.ADMIN;
        emit NewSignerEvent(_newSigner, menbersRoles[_newSigner]);
    }

    function removeSigner(address _Signer) internal onlySelf {
        bool done = false;
        uint8 index;
        for (uint8 i = 0; i < menbers.length; i++) {
            if (menbers[i] == _Signer) {
                index = i;
                done = true;
            }
        }
        require(done, "Signer not fund");
        require(menbers.length > 1, "Last signer can't be removed !");
        for (uint256 i = index; i < menbers.length - 1; i++) {
            // shifting the element in the array from index to the last
            menbers[i] = menbers[i + 1];
        }
        menbers.pop(); //remove the last entry of the array
        if (signRequired > menbers.length && signRequired > 1) {
            signRequired--;
        } //should maybe use a require statement to be sure that there will never be more signature needed that menbers ??...
        emit RemovedSignerEvent(_Signer);
    }

    function setSignersRequired(uint8 _signRequired) internal onlySelf {
        require(_signRequired <= menbers.length, "Can't have more signers than menbers");
        signRequired = _signRequired;
        emit SigneRequiredEvent(signRequired);
    }

    function getSigners() public view returns (address[] memory) {
        return menbers;
    }

    function getMenberRole(address menber) public view returns (Role) {
        return menbersRoles[menber];
    }
    receive()external payable {}

    fallback() external payable {}
}
