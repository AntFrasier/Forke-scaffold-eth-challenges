import { Form, Select } from 'antd';
import React from 'react'
import AddressInput from './AddressInput';

const ChangeRole = ({mainnetProvider,members}) => {
    const enumRole = ["null", "admin", "officer", "user", "God"]; //todo add roles to the multisig
   

    const membersOption = [];
    for (let i =0; i<members.length; i++) {
        membersOption.push({
            label:members[i],
            value:members[i]

        })
    }
  return (
    <div>
        <Form title='Add a Signer' style={{ width: "350px" }}> Change a member role
        <div>
        <Select
                
                options={membersOption}
             />
            <AddressInput
                autoFocus
                ensProvider={mainnetProvider}
                placeholder={"New member address"}
                value={"test"}
                onChange={(e) => {
                
                console.log(e);
               
                }}
            />
            <Select
                defaultValue={3}
                options={options}
             />
            </div>
        </Form>
    </div>
  )
}

export default ChangeRole