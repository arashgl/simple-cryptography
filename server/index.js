const secp = require("ethereum-cryptography/secp256k1")
const express = require("express");
const app = express();
const cors = require("cors");
const {keccak256} = require("ethereum-cryptography/keccak");
const {toHex} = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    "020b8cc51cace5d52709bad69dfda05dd99931c0e184b75eec92f8210f6a7b8480": 100,
    "039b1c13fe370a2097d71a25f007f3cf60f1090e5e24eddd1d294e0215914c0551": 50,
    "02bbde802ef1a2df8b1a114308a6b2f25d4d12a8145782d8ac40e64df0d80aa828": 75,
};

app.get("/balance/:address", (req, res) => {
    const {address} = req.params;
    const balance = balances[address] || 0;
    res.send({balance});
});

app.post("/send", (req, res) => {
    const {
        sender, recipient, amount, signature
    } = req.body;

    const serialized_signature = {
        r: BigInt(signature.r),
        s: BigInt(signature.s),
        recovery: signature.recovery
    }
    
    const messageHash = keccak256(Uint8Array.from(Array.from(recipient.toString() + amount.toString()).map(letter => letter.charCodeAt(0))));

    const verified = secp.secp256k1.verify(serialized_signature, toHex(messageHash), sender);
    if(verified){
        setInitialBalance(sender);
        setInitialBalance(recipient);

        if (balances[sender] < amount) {
            res.status(400).send({message: "Not enough funds!"});
        } else {
            balances[sender] -= amount;
            balances[recipient] += amount;
            res.send({balance: balances[sender]});
        }
    }
    else {
        res.status(400).send({message: "Signature is invalid!"});
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
