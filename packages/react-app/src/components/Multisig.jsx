import React from "react";
import { Card, Col, Divider, Row, Tooltip } from "antd";
import { useBalance, useContractLoader, useContractReader } from "eth-hooks";
import Address from "./Address";
import { useEffect } from "react";
import { useState } from "react";
import Balance from "./Balance";
import { ethers } from "ethers";
import axios from "axios";

const Multisig = ({ readContracts, provider, contractConfig, chainId, signer, apiBaseUrl, writeContracts }) => {
  const contracts = useContractLoader(provider, contractConfig, chainId);
  const MultiSigCm = contracts ? contracts["MultiSigCm"] : "";
  const address = MultiSigCm ? MultiSigCm.address : "";
  const menbers = useContractReader(readContracts, "MultiSigCm", "getSigners");
  const neededSign = useContractReader(readContracts, "MultiSigCm", "signRequired");
  const executeTx = useContractLoader(writeContracts, "MultiSigCm", "execute") 
  // const encoder = new ethers.utils.AbiCoder;
  // const encodedTest = encoder.encode(["string", "uint8", "bytes[]"], ["test", 2, [0,0,32]]);
  const [hashed, setHashed] = useState();
  const [signedMess, setSignedMess] = useState([]);
  const [solidityStruc, setSolidityStruct] = useState([]);

  async function savToDatabase ( data ) {
    try {
    let result = await axios.post( apiBaseUrl + "signedMessage", { data }); //should do a try catch here
    console.log (result.data)
  } catch (err) {
    console.log(err);
  }
  }

  async function sign(mess) {
    // let hash = await useContractReader(readContracts, "MultiSigCm", "getHash");
    let hash = await MultiSigCm.getHash(mess[0], mess[1], mess[2], mess[3], mess[4]);
    console.log('has : ', hash[1])
    const signature = await signer.signMessage(ethers.utils.arrayify(hash[0]));
    setSignedMess([...signedMess, signature]);
    console.log(signedMess);
    setHashed(hash[0]);
    setSolidityStruct([mess[0], mess[1], mess[2], mess[3], mess[4]]);
  }

  async function execute() {
    const sigArray = [signedMess[0]]
    let executeTx = await writeContracts["MultiSigCm"].execute("2", "0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B", "10000000000000000", "0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B", "2", sigArray, {});
    console.log(executeTx)
    // let tx = await executeTx.execute(solidityStruc,signedMess);
    // console.log(tx)
  }

  const displayMenbers = menbers
    ? menbers.map((menber, index) => {
        return (
          <Row key={index} style={{ display: "flex", justifyContent: "center" }}>
            <Col>
              {" "}
              <Address address={menber} />{" "}
            </Col>
          </Row>
        );
      })
    : null;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
      <Card style={{ width: "450px" }}>
        <Row title="Header" style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: "0px" }}> MultiSig </h2>{" "}
          <span>
            <Address address={address} /> <Balance address={address} />
          </span>
        </Row>
        <Divider />
        <Row title="Signers" style={{ display: "flex", justifyContent: "center" }}>
          <Col title="Menbers">Menbers</Col>
        </Row>
        {displayMenbers}
        <Row style={{ flexDirection: "row-reverse" }}>
          <b>&nbsp;{neededSign}</b> Signature(s) required :{" "}
        </Row>
        <Divider />
        <Row title="transaction list" style={{ display: "flex", justifyContent: "center" }}>
          <Col title="Menbers">Transaction waiting</Col>
        </Row>
        {hashed}
        {/* balance : {balance} */}
        <button
          onClick={() => {
            sign( ["2",
                   "0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B",
                   "10000000000000000",
                   "0x67dFe20b5F8Bc81C64Ef121bF8e4228FB4CBC60B",
                   "2"]);
          }}
        >
          sign
        </button>
        <ul>{signedMess.map( (mess, index) => <li key={index}>{mess}</li>)}</ul>
        <button
          onClick={() => {
            savToDatabase(signedMess);
          }}
        >
          save to Datbase
        </button>
        <button
          onClick={() => {
            execute();
          }}
        >
          sendTx
        </button>
       
      </Card>
    </div>
  );
};

export default Multisig;

//rafce
