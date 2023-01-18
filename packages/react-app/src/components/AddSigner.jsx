import React, {useState} from 'react';
import { Form, Button } from 'antd';
import { ethers } from 'ethers';
import Blockies from "react-blockies";
import proposeTx from '../helpers/propseTx';
import AddressInput from './AddressInput';

const AddSigner = ({menbers, multiSigAdd, mainnetProvider, apiBaseUrl, neededSigns}) => {
    const [newSigner, setNewSigner] = useState("");
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);

    function checkMenberPresence (address) {
        return menbers.find( (menber) => {
             if (menber.toLowerCase() == address.toLowerCase()) {
                 return true;
             } else return false
         })
     }

    async function handlePropose() {
        try {
        setLoading(true)
        await proposeTx(apiBaseUrl, "addSigner(address)", [["address"] , [newSigner]], multiSigAdd, 0, neededSigns);
        setNewSigner("")
        setActive(false);
        setLoading(false);
        } catch (err) {
            console.log(err);
            setActive(false);
            setLoading(false);
        }
    }


  return (
    <div><Form title='Add a Signer' style={{ width: "350px" }}> New Signer Address
    <AddressInput
                  autoFocus
                  ensProvider={mainnetProvider}
                  placeholder={"New menber address"}
                  value={newSigner}
                  onChange={(e) => {
                    setActive(false);
                    console.log(e);
                    setNewSigner(e);
                    if ( checkMenberPresence(e)) setActive(false)
                        else if (ethers.utils.isAddress(e) ) setActive(true )
                    }}
                />
   
    { (newSigner.length > 0 )&&(!ethers.utils.isAddress(newSigner))? (<p>Add a valid address</p>) : null}
    {!active && (ethers.utils.isAddress(newSigner) )? (<p style={{color:"red"}}>You can't add a signer that's already a menber</p>) : null}
    <Button title="Propose" 
            disabled={!active}
            onClick={() => handlePropose() } 
            loading={loading}
            style={{marginTop:"15px"}}
            >Propose
    </Button>
</Form></div>
  )
}

export default AddSigner