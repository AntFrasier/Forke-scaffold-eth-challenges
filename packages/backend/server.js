const express = require ('express');
const fs = require ('fs');
const fsPromises = require('fs').promises;
const cors = require('cors')
const app = express();

//todo handle auth

app.use(cors())
app.use(express.json());
//todo store the transaction that is wanted
app.post('/api/signedMessage', async (req, res) => {

    console.log(req.body.req);
    try {
        let saved = await fsPromises.appendFile("signMessage.json", JSON.stringify(req.body.req)); // (err) => console.log('erreur', err)
        res.status(201).send("signed Message saved");
    } catch { (err) => res.status(400).send("erreur", err) } //
})

//store the pending signs 
app.get('/api/transactions', (req, res) => {
    console.log("api requested")
    res.status(200).send("Request done")
})



//return the pending signs

//return the transaction that are waiting
app.get('/api/transactions', (req, res) => {
    console.log("api requested")
    res.status(200).send("Request done")
})

const port = (process.env.PORT || 33550)

app.listen(port, () => {
    console.log("Server is runing on port : ", port)
})