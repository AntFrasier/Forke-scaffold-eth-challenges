import React from 'react';
import { Row, Button} from 'antd';
import Address from "./Address";
import Balance from "./Balance";
import { DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import proposeTx from '../helpers/propseTx';

const Members = ({apiBaseUrl,members, roles, neededSigns, multiSigAdd, mainnetProvider, blockExplorer}) => {
    const enumRole = ["null", "admin", "officer", "user"]; //todo add roles to the multisig
    const history = useHistory();
    var displayMembers;

    console.log("reoles dans Members jsx : " , roles)

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
            <div style={{justifySelf :"end" }}>
  
            <div style={{display : "flex", flexDirection:"column"}}>
                <div> role : </div>
                <div><b>{role}</b></div> 
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
    
    {members?.map ((member, index) => displayMembers(member, index, enumRole[roles[index]]))}
    <Row style={{ flexDirection: "row-reverse", fontSize:"0.75rem", paddingTop:"12px", marginBottom:"-12px" }}>
      <b>&nbsp;{neededSigns}</b> Signature(s) required :{" "}
    </Row>
    </div> 
  )
}

export default Members