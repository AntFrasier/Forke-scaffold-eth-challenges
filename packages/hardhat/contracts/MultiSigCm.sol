//SPDX-License-Identifier: MIT
//Cyril Maranber 11 2022 Scaffold eth multisig challenge
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/*  
**Off-chain: ⛓🙅🏻‍♂️**

 - Generation of a packed hash (bytes32) for a function call with specific parameters through a public view function.
 - It is signed by one of the signers associated to the multisig, and added to an array of signatures (`bytes[] memory signatures`)

**On-Chain: ⛓🙆🏻‍♂️**

 - `bytes[] memory signatures` is then passed into `executeTransaction` as well as the necessary info to use `recover()` 
to obtain the public address that ought to line up with one of the signers of the wallet.
   - This method, plus some conditional logic to avoid any duplicate entries from a single signer, is how votes for a specific 
transaction (hashed tx) are assessed.
 - If it's a success, the tx is passed to the `call(){}` function of the deployed MetaMultiSigWallet contract (this contract),
thereby passing the `onlySelf` modifier for any possible calls to internal txs such as 
(`addSigner()`,`removeSigner()`,`transferFunds()`,`updateSignaturesRequried()`). */

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

    //todo Add roles to menbers
    enum FunctionCalled {
        ADDSIGNER,
        REMOVESIGNER,
        SETREQUIREDSIGNATURES,
        SENDETH
    }

    struct Params {
        uint8 functionCalled;
        address to;
        uint256 amount;
        address signer;
        uint8 signRequired;
    }
    uint256 ID = 0 ;

    mapping(address => Role) menbersRoles;
    mapping(uint256 => Params) transactionID;
    //mapping(uint => address) menbers;  //this an array of menbers maybe an address[] menbers ...
    //todo add roles like GM, officer, user and pondarate the signatures needed with it like : sign needed 2 officer ans 4 users or 1 gm + 1 officer
    address public sender;

    event NewSignerEvent(address signer);
    event RemovedSignerEvent(address signer);
    event SigneRequiredEvent(uint8 signerRequired);

    modifier onlySelf() {
        require(msg.sender == self, "not self"); //todo change this to the good logic ....
        _;
    }

    constructor() {
        self = address(this);
    }

    function isValidSignature(bytes32 _hash, bytes memory signature)
        internal
        returns (bool)
    {
        // todo check if the signer is menber
        address signer = _hash.toEthSignedMessageHash().recover(
            signature
        );
        // sender = signer;
        for (uint8 i = 0; i < menbers.length ; i++) {
            if (menbers[i] == signer) return true;
        }
        return false;
    }

   function getHash(uint8 _functionCalled, address _to, uint256 _amount, address _signer,  uint8 _signRequired) public pure returns (bytes32 _hash, Params memory data) {
    // function getHash(uint8 _functionCalled, uint8 _signRequired) public pure returns (bytes32 _hash) {
        Params memory data;
        data.functionCalled = _functionCalled;
        data.to = _to;
        data.amount = _amount;
        data.signer = _signer;
        data.signRequired = _signRequired;
        // ID += 1;
        // transactionID[ID] = data;
        return (keccak256(abi.encode(data)), data);
    }

    function execute(uint8 _functionCalled, address _to, uint256 _amount, address _signer,  uint8 _signRequired, bytes[] memory signatures) external {
        require(signatures.length >= signRequired, "not enough signaures !");
        console.log(signatures.length);
        Params memory mess;
        mess.functionCalled = _functionCalled;
        mess.to = _to;
        mess.amount = _amount;
        mess.signer = _signer;
        mess.signRequired = _signRequired;
        bytes32 msgHash = keccak256(abi.encode(mess));
        console.log(isValidSignature(msgHash, signatures[0]));
        uint8 validSignature = 0;
        for (uint8 i = 0 ; i < signatures.length  ; i++) {
         if (isValidSignature(msgHash, signatures[i])) {
            validSignature++;
            if (validSignature == signRequired) { break; } //gas saving 
         }
        }
        require (validSignature >= signRequired, "not enough valide signatures !");
        if (mess.functionCalled == 0) {
            addSigner(_signer);
        } else if (mess.functionCalled == 1) {
            removeSigner(_signer);
        } else if (mess.functionCalled == 2) {
            setSignersRequired(_signRequired);
        } else if (mess.functionCalled == 3) {
             ( bool sucess, ) = _to.call{value: _amount}("");
            require (sucess, "transfert failed");
        } 
        console.log("youhou", mess.functionCalled);
    }

    function addSigner(address _newSigner) public { //todo set public to internal and only self after tests
        // todo the public should be changed by private after test
        //todo be sure the signer is not allready here
        // self = owner();
        menbers.push(_newSigner);
        menbersRoles[_newSigner] = Role.ADMIN;
        emit NewSignerEvent(_newSigner);
    }

    function removeSigner(address _Signer) public { //todo set public to internal and only self after tests
        // todo the public should be changed by private after test
        
        bool done = false;
        uint8 index;
        for (uint8 i = 0; i < menbers.length; i++) {
            if (menbers[i] == _Signer) {
                index = i;
                done = true;
            }
        }
        require(done, "Signer not fund");
        require(menbers.length > 1, "Last signer can't be removed !" );
        for (uint256 i = index; i < menbers.length - 1; i++) {
            // shifting the element in the array from index to the last
            menbers[i] = menbers[i + 1];
        }
        menbers.pop(); //remove the last entry of the array
        if (signRequired > menbers.length && signRequired > 1) {
            signRequired--;
        } //should maybe use a require statement to be sure that there will never be more signature needed that menbers ...
        emit RemovedSignerEvent(_Signer);
    }

    function setSignersRequired(uint8 _signRequired) public onlySelf {
        // todo the public should be changed by private after test
        require(
            _signRequired <= menbers.length,
            "Can't have more signers than menbers"
        );
        signRequired = _signRequired;
        emit SigneRequiredEvent(signRequired);
    }

    function getSigners() public view returns (address[] memory) {
        return menbers;
    }

    receive() external payable {}

    fallback() external payable {}
}
