import React from "react";
import { Button, Card, Col, Divider, Row } from "antd";
import { useContractLoader } from "eth-hooks";
import Address from "./Address";
import Balance from "./Balance";
import AddSigner from "./AddSigner";
import proposeTx from "../helpers/propseTx";
import AddSignatures from "./AddSignatures"
import SendEth from "./SendEth";
import AddCustomCall from "./AddCustomCall";
import { useHistory } from "react-router-dom";

const Multisig = ({ provider, contractConfig, chainId, apiBaseUrl, price, menbers, mainnetProvider, neededSigns }) => {

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const MultiSigCm = contracts ? contracts["MultiSigCm"] : "";
  const multiSigAdd = MultiSigCm ? MultiSigCm.address : "";
  const history = useHistory();
 // const enumRole = ["null", "admin", "user", "dude"]; //todo add roles to the multisig

  async function getRole (add) {
    let role =  0;//await MultiSigCm.getMenberRole(add); // todo add roles working...
    console.log ("role ds function", role)
    return role;
  }

  const displayMenbers = menbers
    ? menbers.map( (menber, index) => {
       let role = getRole(menber); //wird error with roles ... todo add a correct role management
        return (
          <Row key={index} style={{ display: "flex", justifyContent: "center" }}>
            <Col>
              {" "}
              <Address address={menber} /> {" "} 
            </Col>
            <Col>
              {" "}
              <Button   
                disabled = {menbers.length > 1 ? false : true} 
                onClick = { () => {
                  proposeTx(apiBaseUrl, "removeSigner(address)", [["address"] , [menber]], multiSigAdd, 0, neededSigns)
                  history.pushState("/transactions");
                }}
              >remove</Button>
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
            <Address address={multiSigAdd} /> <Balance address={multiSigAdd} provider={provider} dollarMultiplier={price}/>
          </span>
        </Row>
        <Divider />
        <Row title="Signers" style={{ display: "flex", justifyContent: "center" }}>
          <Col title="Menbers">Menbers</Col>
        </Row>
        {displayMenbers}
        <Row style={{ flexDirection: "row-reverse" }}>
          <b>&nbsp;{neededSigns}</b> Signature(s) required :{" "}
        </Row>
        <Divider />
        <Row title="Add a menber" style={{ display: "flex", justifyContent: "center" }}>
        <AddSigner 
          menbers = {menbers} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          />
        </Row>
        <Divider />
        <Row title="Add Sigantures" style={{ display: "flex", justifyContent: "center" }}>
        <AddSignatures
          menbers = {menbers} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          />
        </Row>
        <Divider />
        <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
        <SendEth
          menbers = {menbers} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          price={price}
          />
           </Row>
          <Divider />
          <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
          <AddCustomCall
          menbers = {menbers} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          price={price}
          />
         </Row>
      </Card>
    </div>
  );
};

export default Multisig;

