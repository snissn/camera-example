import Web3 from 'web3'
import { fetchUserItems } from '../lib/utility'
const SignerProvider = require('ethjs-provider-signer')

const EC = require('elliptic').ec
const ec = new EC('secp256k1')

export var w3 = new Web3('https://chain.token.ax:443')
export var w3ws = new Web3('wss://chain.token.ax:443')
const contract_address = '0x9eF96617d4179c38af5631f76A1dE9156837706C'

import abi from '../contracts/App_sol_App.json'

function setupAccounts() {
  fetchUserItems('keys').then((key) => {
    if (key.length == 0) {
      return
    }

    const ethPrivKey = key[0]['key']

    var me = w3ws.eth.accounts.privateKeyToAccount(ethPrivKey)

    const address = me.address

    const privateKey = me.privateKey

    const account = w3.eth.accounts.privateKeyToAccount(privateKey)

    var localprovider = new SignerProvider('https://chain.token.ax:443', {
      signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),
      accounts: (cb) => cb(null, [address]),
    })
    w3.setProvider(localprovider)

    w3.eth.accounts.wallet.add(account)
    w3.eth.defaultAccount = account.address
    contract.options.from = account.address
    localStorage.setItem('ACCOUNT', account.address)
  })
}
import abi_tweets from '../contracts/App_sol_Tweets.abi'
const contract = new w3.eth.Contract(abi, contract_address)
const contractws = new w3ws.eth.Contract(abi, contract_address)

function generateKeys() {
  var privateKey = w3.utils.randomHex(32)
  const key = privateKey.toString('hex')
  const ephemPrivKey = ec.keyFromPrivate(privateKey)
  const ephemPubKey = ephemPrivKey.getPublic()
  const pub = Buffer.from(ephemPubKey.encode()).toString('hex')
  const address = w3.eth.accounts.privateKeyToAccount(privateKey).address
  return { pub, key, address }
}

export { generateKeys, contract, contractws, setupAccounts }
