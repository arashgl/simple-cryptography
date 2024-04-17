const {secp256k1} = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);

console.log('private key: ', toHex(privateKey))
console.log('public key: ', toHex(publicKey))
console.log('public key hash: ',toHex(keccak256(publicKey.slice(1)).slice(-20)) )

