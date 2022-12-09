import React from "react";
import axios from "axios";
import { Button, Card, Col, Divider, Input, Row } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const ManageSigners = ({ apiBaseUrl }) => {
  const [newSignRequired, setNewSignRequired] = useState(1);
  const [pendingTransactions, setPendingTransaction] = useState("");

  async function getPendingTransactions() {
    await axios
      .get(apiBaseUrl + "transactions")
      .then(res => {
        setPendingTransaction(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }

  async function submitRequest(e) {
    e.preventDefault;
    console.log("this the value : ?", e);
  }

  useEffect(() => {
    getPendingTransactions();
  }, []);

  console.log("pending :", pendingTransactions);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
      <Card style={{ width: "450px" }}>
        <Row>Manage Signers</Row>
        <Divider />

        <Row style={{ display: "flex", justifyContent: "center", marginTop: "15px" }} title="Manage Signatures needed">
          Manage Signatures needed
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}
          title="Manage Signatures needed"
        >
          <Col title="current number needed">
            Current needed : <b>1</b>
          </Col>
          <Col title="Propose a new number ">
            <Input
              type="number"
              value={newSignRequired}
              onChange={e => {
                setNewSignRequired(e.target.value);
              }}
            ></Input>
            <Button
              onClick={() => {
                submitRequest(newSignRequired);
              }}
            >
              Submit
            </Button>
            {/* used an arrow function to avoid rerendering */}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ManageSigners;

/*
hashMessage = keccak256 (message)
sign voir ethereum cryptographie secp.sign(mess, privatekey)
*/
