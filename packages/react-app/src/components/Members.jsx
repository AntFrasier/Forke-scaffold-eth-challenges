import React from 'react';
import { Row, Button, Select} from 'antd';
import Address from "./Address";
import Balance from "./Balance";
import { DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import proposeTx from '../helpers/propseTx';
import { useState } from 'react';

const Members = ({apiBaseUrl,members, roles, neededSigns, multiSigAdd, mainnetProvider, blockExplorer, memberRole}) => {
    const enumRole = ["null", "admin", "officer", "user", "God"]; //todo add roles to the multisig
    const options = [
        {label : "Admin",
         value : 1},
        {label : "Officer",
         value : 2},
        {label : "User",
         value : 3},
        {label : "God",
         value : 4}
    ]
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    var displayMembers;

    console.log("roles dans Members jsx : " , roles)
    console.log("member role : ",memberRole)

    function displayMembers (member, index, role)  {
        return (
          <Row key={index} 
               style={{ paddingTop:"15px",
                        display: "grid", 
                        alignItems:"center", 
                        gridTemplateColumns:"3fr 1fr 0.5fr", 
                        width:"100%", 
                        fontSize:"0.85rem"}}>
              <div style={{justifySelf :"start" }}>
              <Address
               address={member}
               ensProvider={mainnetProvider} 
               blockExplorer={blockExplorer} 
               fontSize={22}
               />
            </div>
            <div style={{justifySelf :"center" }}>
  
            <div style={{display : "flex", flexDirection:"column"}}>
                <div> role : </div>
                <div>
                {((memberRole != 1) && (memberRole != 4)) ? ( <b>{enumRole[role]}</b> 
                ):(  
                <Select
                    style={{width:"100%"}}
                    defaultValue={"role"}
                    loading={loading}
                    value={role}
                    options={options}
                    onChange={ async (e) => { // _functionName, _params, _to, _value, neededSigns
                        setLoading(true);
                        // let newRole = 
                        console.log(e,role, member)
                        proposeTx(apiBaseUrl, "changeRole(address, uint8)",[["address", "uint8"],[member, e]], multiSigAdd, 0, neededSigns )
                        setLoading(false);
                       history.push("/transactions")
                    }}
                />)
                }
                </div>
             </div>
             </div>
             <div style={{justifySelf :"end", paddingLeft : "15px" }}>
              <Button   
                disabled = {members.length > 1 ? false : true} 
                onClick = { async () => {
                  await proposeTx(apiBaseUrl, "removeSigner(address)", [["address"] , [member]], multiSigAdd, 0, neededSigns)
                  history.push("/transactions");
                }}
                icon={<DeleteOutlined />}
              ></Button>
            </div>
          </Row>
        );
    }
  return (
    <div title="Members">Members
    
    {members?.map ((member, index) => displayMembers(member, index, roles[index]))}
    <Row style={{ flexDirection: "row-reverse", fontSize:"0.75rem", paddingTop:"12px", marginBottom:"-12px" }}>
      <b>&nbsp;{neededSigns}</b> Signature(s) required :{" "}
    </Row>
    </div> 
  )
}

export default Members