require('dotenv').config({ path: require('find-config')('.env') });
const { ethers } = require('ethers');

const contract = require('../artifacts/contracts/Wallet.sol/WalletMultiSig.json');

const {
    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    WALLET_CONTRACT
} = process.env;

async function createTransaction(method, params) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const etherInterface = new ethers.utils.Interface(contract.abi);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest');
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
    };

    const estimateGas = await provider.estimateGas(transaction);
    transaction.gasLimit = estimateGas;

    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();

    const hash = transactionReceipt.hash;
    console.log("Transaction hash: ", hash);
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt;
}

async function SubmitTransaction(to, amount) {
    const receipt = await createTransaction('submitTransaction', [to, amount]);
    return receipt;
}

async function submitApproval(idTransaction) {
    const receipt = await createTransaction('approveTransaction', [idTransaction]);
    return receipt;
}

async function executeTransaction(idTransaction) {
    const receipt = await createTransaction('executeTransaction', [idTransaction]);
    return receipt;
}

async function getTransactions() {
    console.log("Obteniendo transacciones desde el contrato...");
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const walletContract = new ethers.Contract(WALLET_CONTRACT, contract.abi, provider);

    console.log("Contrato inicializado. ABI:", contract.abi);

    try {
        const result = await walletContract.getTransactions();
        console.log("Transacciones obtenidas del contrato:", result);

        var transactions = [];
        result.forEach(element => {
            transactions.push(formatTransaction(element));
        });

        console.log("Transacciones formateadas:", transactions);
        return transactions;
    } catch (error) {
        console.error("Error al obtener transacciones:", error.message);
        throw error;
    }
}

async function Deposit(amount) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const walletContract = new ethers.Contract(WALLET_CONTRACT, contract.abi, wallet);

    const tx = await walletContract.Deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    console.log("Deposit done: ", tx.hash);
}

function formatTransaction(info) {
    return {
        to: info[0],
        amount: ethers.BigNumber.from(info[1]).toString(),
        approvalCount: ethers.BigNumber.from(info[2]).toNumber(),
        executed: info[3]
    };
}

module.exports = {
    SubmitTransaction,
    submitApproval,
    executeTransaction,
    getTransactions,
    Deposit,
};
