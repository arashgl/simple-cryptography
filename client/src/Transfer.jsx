import {useState} from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1.js"
import {keccak256} from "ethereum-cryptography/keccak.js";
import {toHex} from "ethereum-cryptography/utils";

function Transfer({address, setBalance, privateKey}) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();
        const messageHash = keccak256(Uint8Array.from(Array.from(recipient + sendAmount).map(letter => letter.charCodeAt(0))));

        try {
            const signature = secp.secp256k1.sign(toHex(messageHash), privateKey);
            const {
                data: {balance},
            } = await server.post(`send`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
                signature: {r: signature.r.toString(), s: signature.s.toString(), recovery: signature.recovery},
            });
            setBalance(balance);
        } catch (ex) {
            console.log(ex)
            alert(ex.response.data.message);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            <input type="submit" className="button" value="Transfer"/>
        </form>
    );
}

export default Transfer;
