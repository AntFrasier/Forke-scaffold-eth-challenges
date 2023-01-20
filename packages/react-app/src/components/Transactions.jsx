import { Card, Button, Row, List, Divider } from 'antd'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Blockies from "react-blockies";
import axios from 'axios';
import { useContractLoader, useContractReader } from 'eth-hooks';
import { ethers } from 'ethers';
import Address from './Address';
import Events from './Events';
import { DeleteOutlined } from '@ant-design/icons';

function Transactions({ apiBaseUrl, provider, mainnetProvider,contractConfig, chainId, neededSigns, signer, menbers, txHelper, readContracts}) {

    
    const contracts = useContractLoader(signer, contractConfig, chainId);
    const MultiSigCm = contracts ? contracts["MultiSigCm"] : "";
    const enumRole = ["null", "admin", "user", "dude"]; //just to remenber
    const [loading, setLoading] = useState(false);
    const [txPending, setTxPending] = useState([])

    // const executeTx = useContractLoader(writeContracts, "MultiSigCm", "execute") 
 
    async function getPendingTransactions() {
        await axios
            .get(apiBaseUrl + "transactions")
            .then(res => {
                setTxPending(res.data.content.txs);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async function pushToDataBase (txId, sign) {
     
        await axios.get(apiBaseUrl + `singleTransaction/${txId}` )
        .then ( async (res) => {
            await axios.post(apiBaseUrl + `updateSingleTransaction/${txId}`, {sign}) 
            getPendingTransactions();
            return true;
        })
        .catch (err => {
            console.log("erreur while pushing sign to database : ",err)
            return false;
        });  
    }

    async function sign(tx) {
        setLoading(true)
        try {
            if (!menbers.includes(signer.address)) throw ("You're not a menber !")
            let hash = await MultiSigCm.getHash(tx.callData, tx.to, tx.value, tx.neededSigns, tx.txId);
            const signature = await signer.signMessage(ethers.utils.arrayify(hash));
            await pushToDataBase(tx.txId, signature);
            setLoading(false);
         } catch (err) {
            console.log("erreur when signing : " , err);
            alert(err)
            setLoading(false);
         }
      }

      async function send (tx) {
        try {
            setLoading(true)
            if (!menbers.includes(signer.address)) throw ("You're not a menber !")
            const sendTx =  
                await txHelper(
                    MultiSigCm.execute( tx.callData,tx.to, tx.value, tx.neededSigns, tx.txId, tx.signatures), 
                    async (update) => {
                        if (update && (update.status === "confirmed" || update.status === 1)) {
                            await axios.get(apiBaseUrl+`deleteTx/${tx.txId}`);
                        }
                    }
                );
        } catch (err) {
            console.log("erreur while sending execute functin to BC" , err)
            alert(err)
            
        } finally {
            setLoading(false)
            getPendingTransactions();
        }

      }


   
    useEffect(() => {
        getPendingTransactions();
        const intervale = setInterval ( () => {
            getPendingTransactions();
        }, 10000) // 10s 
        return () => clearInterval(intervale)
    }, [])
  
    return (
        <div className='Transactions' style={{display:"flex",  display: "flex", justifyContent: "center", alignItems:"center", flexDirection: "column" }}>
            <Card title="Pending transactions" style={{display : "flex", flexDirection: "column", fontSize:"1rem",width: "500px", maxWidth : '100%'}}>
                {txPending ? txPending.map(
                    (tx, index) => 
                    <Row key={index} style={{display : "flex", Border: "solid 1px black",flexDirection: "row", alignItems:'center', justifyContent:'space-evenly'}}>
                         #{tx.txId} 
                         <Address address={tx.to} /> 
                         <div style={{display:"flex", flexDirection:"column", fontSize:"0.75rem"}}>
                            <div>{(tx.functionName === "") ? "Transfert" : tx.functionName.substring(0,tx.functionName.indexOf("("))}</div>
                            <div>{(tx.params[1] == "") ? (
                                "Ξ" + ethers.utils.formatEther(tx.value).substring(0,12) 
                                ) : ( 
                                (tx.params[1].length < 12) ? (""+tx.params[1]).substring(0,12) + "..." :  tx.params[1]
                                )
                            }
                            </div>
                        </div> 
                        {tx.signatures?.length} 
                        / 
                        {neededSigns}
                        <div style={{display:"flex", flexDirection:"column", fontSize:"0.75rem"}}>
                            <Button
                                loading={loading}
                                onClick={ () => sign(tx)}> 
                            Sign
                            </Button>
                            <Button
                                type="primary"
                                disabled={(tx.signatures?.length < neededSigns)}
                                style={{marginTop:"5px"}}
                                loading={loading}
                                onClick={ () => send(tx)}>
                               
                            send
                            </Button>
                        </div>
                        <Button 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={ async () => {
                                setLoading(true);
                                await axios.get(apiBaseUrl+`deleteTx/${tx.txId}`);
                                getPendingTransactions();
                                setLoading(false);
                                }}>
                        </Button>

                    <Divider/>
                    </Row> ) : null}                  
            </Card>

            <List title="Transactions done">
                Tx Done : <br />
                <Events
                    contracts={readContracts}
                    contractName="MultiSigCm"
                    eventName="TxSent"
                    localProvider={provider}
                    mainnetProvider={mainnetProvider}
                    startBlock={1}
                />
            </List>
        </div>
    )
}

export default Transactions