import React from "react";
import {  Card, Divider, Row } from "antd";
import { useContractLoader } from "eth-hooks";
import Address from "./Address";
import Balance from "./Balance";
import AddSigner from "./AddSigner";
import proposeTx from "../helpers/propseTx";
import AddSignatures from "./AddSignatures"
import SendEth from "./SendEth";
import AddCustomCall from "./AddCustomCall";
import { useState } from "react";
import { useEffect } from "react";
import Members from "./Members";

const Multisig =  ({ provider,contractConfig, chainId, apiBaseUrl, price, mainnetProvider, neededSigns, blockExplorer, members, setMembers}) => {

  const contracts = useContractLoader(provider, contractConfig, chainId);
  const MultiSigCm = contracts ? contracts["MultiSigCm"] : "";
  const multiSigAdd = MultiSigCm ? MultiSigCm.address : "";
  const [roles, setRoles] = useState([]);

  async function getRole (_members) { //used a for instead a foreach or map cause i had issue with its
    let oldRoles = [];
    for (let i = 0 ; i<_members.length; i++) { //this is a bit wird need to refactore that part but this is the only way i found to did it :p
      let newRoles = [...oldRoles];
      let role = await MultiSigCm.getMemberRole(_members[i]);
      newRoles.push(role);
      oldRoles = [...newRoles];
      setRoles(newRoles)
   }
  }
   async function getMembers (){
    let newMembers = await MultiSigCm.getSigners();
    setMembers(newMembers)
    getRole(newMembers);
   }

  useEffect( () => {
   if (MultiSigCm)  getMembers();
  }, [MultiSigCm]);

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
          <Members
            members={members}
            roles={roles}
            multiSigAdd={multiSigAdd}
            neededSigns={neededSigns}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            />
        </Row>
        <Divider />
        <Row title="Add a member" style={{ display: "flex", justifyContent: "center" }}>
        <AddSigner 
          members = {members} 
          multiSigAdd = {multiSigAdd}
          mainnetProvider={mainnetProvider}
          apiBaseUrl = {apiBaseUrl}
          neededSigns = {neededSigns}
          blockExplorer = {blockExplorer}
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

