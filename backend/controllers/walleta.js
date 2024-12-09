require('dotenv').config({ path: require('find-config')('.env') })
const { ethers } = require('ethers')
const contract = require('../artifacts/contracts/Wallet.sol/WalletMultiSig.json')

const {

    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    SALES_CONTRACT,
    WALLET_CONTRACT
} = process.env
async function createTransaction(provider,method,params){
    const etherInterface = new ether.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY,'latest')
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const { chainId } = network;
    const transaction = {
        from: PUBLIC_KEY,
        to: WALLET_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, params)
    }
    return transaction;
}

async function submitTransaction(to,amount){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new ethers.wallet(PRIVATE_KEY,provider)
    const transaction = await createTransaction(provider,"submitTransaction",(to,amount))
    const estimateGas = await provider.estimateGas(transaction);
    transaction =["gasLimit"]=estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction hash: ",hash)
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt
}

async function submitApproval(idTransaction){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new ethers.wallet(PRIVATE_KEY,provider)
    const transaction = await createTransaction(provider,"approveTransaction",[idTransaction])
    const estimateGas = await provider.estimateGas(transaction);
    transaction =["gasLimit"]=estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction hash: ",hash)
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt
}

async function executeTransaction(idTransaction){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new ethers.wallet(PRIVATE_KEY,provider)
    const transaction = await createTransaction(provider,"executeTransaction",[idTransaction])
    const estimateGas = await provider.estimateGas(transaction);
    transaction =["gasLimit"]=estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx)
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction hash: ",hash)
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt
}

async function getTransactions(){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const walletContract = new ethers.Contract(WALLET_CONTRACT,contract.abi,provider)
    const result = await walletContract.getTransactions();
    result.forEach(element => {
        transaction.psuh(formatTransaction(element))
    });

    console.log(transactions)
    return transactions
}

async function Deposit(amount){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY,provider)
    const walletContract = new ethers.Contract(WALLET_CONTRACT,contract.abi,wallet)
    const tx = await walletContract.Deposit({value:ethers.utils.parseEther(amount)})
    await tx.wait();
    console.log("Deposit done: ",tx.hash)
}

async function formatTransaction(){
    return{
        to:[0],
        amount:ethers.BigNumber.from(info[1]).toString(),
        approvalCount:ethers.BigNumber.from(info[2]).toNumber(),
        executed:info[3]

    }
}

//submitTransaction("0x6e3dE260d476B5F2C791cCf8aeCE2555840ae268",ethers.utils.parseEther("0.1"))
//getTransactions()
 