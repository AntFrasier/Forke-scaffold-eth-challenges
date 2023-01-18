const express = require('express');
const fs = require('fs');
const { exists } = require('fs');
const fsPromises = require('fs').promises;
const cors = require('cors');
const app = express();

let txPending = [];

let txId = 2000;

app.use(cors())
app.use(express.json());

app.post('/api/addTransaction', async (req, res) => {
    console.log("api post a new transaction");
    var toSave = ""
    try {
        await fsPromises.access("./transactions.json")
            .then(async () => {
                await fsPromises.readFile('./transactions.json')
                    .then(async (data) => {
                        console.log("data : ", JSON.parse(data));
                        let content = JSON.parse(data)
                        content.txs.push(req.body);
                        let contentString = JSON.stringify(content)
                        toSave = contentString;//todo take care of the coma here of the empty 
                        txId++;
                        await fsPromises.writeFile("./transactions.json", toSave);
                    })
                    .catch((err) => {
                        console.log("erreur in catch readfile", err)
                    })

            })
            .catch(async (err) => {
                console.log("first catch errer ", err)
                console.log("request body dot data : ", req.body)
                toSave = `{ "txs" : [${JSON.stringify(req.body)}` + "]}";
                txId++;
                await fsPromises.appendFile("./transactions.json", toSave);
            })
        res.status(201).send("transaction saved");
    } catch { (err) => res.status(400).send("erreur") } //
});

app.post('/api/updateSingleTransaction/:id', async (req, res) => {
    console.log("api update the transcation with id : ", req.params.id)
    const id = req.params.id;
    const sign = req.body.sign;
    await fsPromises.readFile('./transactions.json')
        .then( async (data) => {
            let content = JSON.parse(data);
            let transactions = await content.txs.map( (tx) => {
                // console.log(tx)
                console.log(sign)
                console.log(tx.txId == id && !tx.signatures.includes(sign) )
                if(tx.txId == id && !tx.signatures.includes(sign) ) tx.signatures.push(sign);
                return tx;
            });
            console.log(transactions)
            await fsPromises.writeFile("./transactions.json", `{"txs" : ${JSON.stringify(transactions)} }`);
            res.status(200).send( {transactions} )
        })
        .catch((err) => {
            console.log("erreur in finding transaction id", err)
            res.status(404).send({ message: "not find" })
        })

});


//store the pending signs 
app.get('/api/txId', async (req, res) => {
    console.log("api txId requested");
   try {
    res.status(200).send({ txId })
   } catch (err) {
            console.log("erreur in catch readfile", err)
            res.status(404).send({ message: "not find" })
        }
});

app.get('/api/singleTransaction/:id', async (req, res) => {
    console.log("api get the transcation with id : ", req.params.id)
    const id = req.params.id;
    await fsPromises.readFile('./transactions.json')
        .then( async (data) => {
            let content = JSON.parse(data);
            let transaction = await content.txs.filter( function (tx) {
                return tx.txId == id;
            });
            res.status(200).send( transaction)
        })
        .catch((err) => {
            console.log("erreur in finding transaction id", err)
            res.status(404).send({ message: "not find" })
        })

});

app.get('/api/deleteTx/:id', async (req, res) => {
    console.log("api delete the transcation with id : ", req.params.id)
    const id = req.params.id;
    await fsPromises.readFile('./transactions.json')
        .then( async (data) => {
            let content = JSON.parse(data);
            let transactions = await content.txs.filter( function (tx) {
                return tx.txId != id;
            });
            console.log(" it should have removed the tx " , transactions)
            await fsPromises.writeFile("./transactions.json", `{"txs" : ${JSON.stringify(transactions)} }`);
            res.status(200).send( transactions );
        })
        .catch((err) => {
            console.log("erreur in finding transaction id", err)
            res.status(404).send({ message: "not find" })
        })

});

app.get('/api/transactions', async (req, res) => {
    console.log("api all transactions requested");
    await fsPromises.readFile('./transactions.json')
        .then((data) => {
            console.log("data : ", data);
            let content = JSON.parse(data);
            res.status(200).send({ content })
        })
        .catch((err) => {
            console.log("erreur in catch readfile", err)
            res.status(404).send({ message: "not find" })
        })
});

const port = (process.env.PORT || 33550)

app.listen(port, () => {
    console.log("Server is runing on port : ", port)
})