import { Input, Button, Select, Row, Tooltip } from 'antd';
import React from 'react'
import { useState } from 'react';
import AddressInput from './AddressInput'
import EtherInput from './EtherInput'
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import proposeTx from '../helpers/propseTx';
import { ethers } from 'ethers';

const AddCustomCall = ({apiBaseUrl, neededSigns,mainnetProvider, price}) => {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("0");
    const [functionName, setFunctionName] = useState("");
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState();
    const [args, setArgs] = useState();
    const [params, setParams] = useState([[], []]);
    const count = 0;

    async function handlePropose() {
        // apiBaseUrl, _functionName, _params, _to, _value, neededSigns
        console.log(apiBaseUrl, functionName, params, to, amount, neededSigns);
        proposeTx(apiBaseUrl, functionName, params, to, amount, neededSigns);

    }
    function getArg ( string, index) {
        let test = string.split(",", index).join(",").length;
        // console.log("test" , test)
        return test;
    }
    function handleFunctionName (value) {
        setFunctionName(value);
        console.log("value : ", value) 
        let i = 0;         
        while ((value.indexOf(" ") !== -1 ) && i < 10000 ){
            console.log (value)
            let newValue = value.replace(" ","");
            value = newValue;
            i++; //prevent infinite loop ...
            }
        let stringWithoutSpace = value;
        console.log("no space :" , stringWithoutSpace)
        setArgs([]);
        if ((value.indexOf("(") !== -1) && (value.indexOf(")") !== -1)) {
            let betweenParantheses = stringWithoutSpace.substring(stringWithoutSpace.indexOf("(") +1 ,stringWithoutSpace.indexOf(")") )
            let index = (betweenParantheses.match(/,/g) || []).length + 1;
            let indexOfComa = [0]
            for (let i = 1 ; i < (index) ; i++) {
                let arg = getArg(betweenParantheses, i)
                indexOfComa.push(arg);
            }
            let newArgs = []
            
            for (let j = 0; j < index ; j++) {
                let argument = betweenParantheses.substring(indexOfComa[j],indexOfComa[j+1])
                newArgs.push(argument.substring(argument.indexOf(",")+1))
            }
            setArgs(newArgs);
            let oldParams = params;
            oldParams[0] = newArgs;
            setParams(oldParams);
            
        }
    }

    function displayArguments(args, index){
        let toDisplay = [];
        console.log("Args : ", args)
        switch (args) {
            case "uint256" :
                toDisplay = (
                    <Row key={index}> 
                        <Input 
                            placeholder='uint256' 
                            value={params[1][index]}
                            onChange={ (e) => {
                                let oldParam = params;
                                oldParam[1][index] = e.target.value;
                                setParams(oldParam);
                                }
                            }
                            suffix={<Tooltip placement="right" title="* 10 ** 18">
                            <div
                              type="dashed"
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                let newValue = params;
                                const floatValue = parseFloat(params[1][index]);
                                if (floatValue) {
                                newValue[1][index] = ("" + floatValue * 10 ** 18);
                                setParams(newValue);}

                              }}
                            >
                              ✴️
                            </div>
                          </Tooltip>}                
                        />
                    </Row>
                    );
                break;
            case "string" :
            toDisplay = (
                <Row key={index}> 
                    <Input 
                        placeholder='string' 
                        onChange={  (e) => {
                            let oldParam = params;
                            oldParam[1][index] = e.target.value;
                            setParams(oldParam);
                            }}
                    />
                </Row>
                );
            break;
            case "address" :
            toDisplay = (
                    <AddressInput 
                        placeholder='Address'
                        style={{width:"100%"}}
                        value={params[1][index]}
                        onChange={ (value) => {
                            let oldParam = params;
                            console.log(value)
                            oldParam[1][index] = value;
                            setParams(oldParam);
                            }}
                    />
                );
            break;
            default : 
                toDisplay = ("waiting for argume,ts to display");
        }
        return toDisplay;
    }
     useEffect ( () => {
        console.log("params : ",params)
     }, [params])
//mint(uint256)
  return (
    <div>Cusctom Call
        <AddressInput
          autoFocus
          ensProvider={mainnetProvider}
          placeholder="contract address to call"
          value={to}
          onChange={setTo}
        />
        <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
        />
        <Input
            autoFocus
            placeholder='Function Name ex : mint(uint256)'
            value ={functionName}
            onChange={ (e) => {
                handleFunctionName(e.target.value.toLocaleLowerCase());
                
              }}
        />
        {args?.map( (arg, index) => displayArguments(arg, index))}
       
        <Button title="Propose" 
            disabled={!active}
            onClick={() => handlePropose() } 
            loading={loading}
            style={{marginTop:"15px"}}
            >Propose
    </Button>
    </div>
  )
}

export default AddCustomCall