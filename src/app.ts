import { AbiItem } from "web3-utils";
import Web3 from "web3";
import ClaimABI from "./contract/claim/abi.json";
import TransferABI from "./contract/transfer/abi.json";
import { Wallet } from "./types";


const ARBITRUM_CLAIM_CONTRACT_ADDRESS = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9";
const ARBITRUM_TRANSFER_CONTRACT_ADDRESS = "0x912CE59144191C1204E64559FE8253a0e49E6548";
const ARBITRUM_RPC_URL = "https://arb1.arbitrum.io/rpc";
const FROM_WALLET: Wallet = {
    private: "",
    public: ""
};

const TO_WALLET: Wallet = {
    private: "",
    public: ""
};

const web3 = new Web3(ARBITRUM_RPC_URL);
const claimContract = new web3.eth.Contract(ClaimABI as AbiItem[], ARBITRUM_CLAIM_CONTRACT_ADDRESS);
const transferContract = new web3.eth.Contract(TransferABI as AbiItem[], ARBITRUM_TRANSFER_CONTRACT_ADDRESS);
const amount = 1250.0;

const claimAirdropTokens = async (wallet: Wallet) => {
    try{
        const nonce = await web3.eth.getTransactionCount(wallet.public, "latest");
        const tx = {
            from: wallet.public,
            to: ARBITRUM_CLAIM_CONTRACT_ADDRESS,
            nonce: nonce,
            baseFeePerGas: 10000000000,
            maxPriorityFeePerGas: 100000000000,
            gas: 100000,
            data: claimContract.methods.claim().encodeABI()
        };

        const signPromise = web3.eth.accounts.signTransaction(tx, wallet.private);
        
        signPromise.then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
                if (err) throw err;

                console.log(`The hash of your claim transaction is: ${hash}`);
            }).then(() => {
                transferAirdropTokens(wallet).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }catch(err){
        console.log(err);
    }
};

const transferAirdropTokens = async (wallet: Wallet) => {
    try{
        const nonce = await web3.eth.getTransactionCount(wallet.public, "latest");
        const tx = {
            from: wallet.public,
            to: ARBITRUM_TRANSFER_CONTRACT_ADDRESS,
            nonce: nonce, 
            baseFeePerGas: 10000000000,
            maxPriorityFeePerGas: 100000000000,
            gas: 50000,
            data: transferContract.methods.transfer(TO_WALLET.public, amount)
        };

        const signPromise = web3.eth.accounts.signTransaction(tx, wallet.private);

        signPromise.then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
                if (err) throw err;
                console.log(`The hash of your transfer transaction is: ${hash}`);
            });
        }).catch(err => console.log(err));
    }catch(err){
        console.log(err);
    }
};

const checkEthAvailable = () => {
    const intervalId = setInterval(async () => {
        try{
            const balance = await web3.eth.getBalance(FROM_WALLET.public);

            if (balance > web3.utils.toWei("0.0065", "ether")){
                claimAirdropTokens(FROM_WALLET);
                clearInterval(intervalId);
            }
        }catch(err){
            console.log(err);
        }

    }, 1);
};


checkEthAvailable();