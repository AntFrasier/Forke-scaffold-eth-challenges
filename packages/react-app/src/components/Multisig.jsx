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

const Multisig = ({ provider, contractConfig, chainId, apiBaseUrl, price, members, mainnetProvider, neededSigns }) => {

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const MultiSigCm = contracts ? contracts["MultiSigCm"] : "";
  const multiSigAdd = MultiSigCm ? MultiSigCm.address : "";
  const history = useHistory();
 // const enumRole = ["null", "admin", "user", "dude"]; //todo add roles to the multisig

  async function getRole (add) {
    let role = await MultiSigCm.getMemberRole(add); // todo add roles working...
    console.log ("role ds function", role)
    return role;
  }

  const displayMembers = members
    ? members.map( (member, index) => {
       let role = getRole(member); //wird error with roles ... todo add a correct role management
        return (
          <Row key={index} style={{ display: "flex", justifyContent: "center" }}>
            <Col>
              {" "}
              <Address address={member} /> {" "} 
            </Col>
            <Col>
              {" "}
              <Button   
                disabled = {members.length > 1 ? false : true} 
                onClick = { () => {
                  proposeTx(apiBaseUrl, "removeSigner(address)", [["address"] , [member]], multiSigAdd, 0, neededSigns)
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
          <Col title="Members">Members</Col>
        </Row>
        {displayMembers}
        <Row style={{ flexDirection: "row-reverse" }}>
          <b>&nbsp;{neededSigns}</b> Signature(s) required :{" "}
        </Row>
        <Divider />
        <Row title="Add a member" style={{ display: "flex", justifyContent: "center" }}>
        <AddSigner 
          members = {members} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          />
        </Row>
        <Divider />
        <Row title="Add Sigantures" style={{ display: "flex", justifyContent: "center" }}>
        <AddSignatures
          members = {members} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          />
        </Row>
        <Divider />
        <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
        <SendEth
          members = {members} 
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
          members = {members} 
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

