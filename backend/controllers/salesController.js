require('dotenv').config({ path: require('find-config')('.env') })
const { ethers } = require('ethers')
const contract = require('../artifacts/contracts/Sales.sol/Sales.json')

const {
    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    SALES_CONTRACT
} = process.env;


/**
 * Create a transaction to interact with the Sales contract
 * @param {ethers.providers.Provider} provider - ethers provider
 * @param {string} method - method to call on the contract
 * @param {any[]} params - parameters to pass to the method
 * @returns {Promise<ethers.providers.TransactionRequest>} - a TransactionRequest
 */
async function createTransaction(provider,method,params) {
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest')
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainId} = network;

    const transaction = {
        from: PUBLIC_KEY,
        to: SALES_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, params)
    }
    return transaction;
}
    async function createSale(userId, items, prices) {
        const provider = new ethers.providers.JsonRpcProvider(API_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const transaction = await createTransaction(provider, 'insertSale', [userId, items, prices]);
        const estimatedGas = await provider.estimateGas(transaction);
        transaction.gasLimit = estimatedGas;
        const signedTx = await wallet.signTransaction(transaction);
        const transactionReceipt = await provider.sendTransaction(signedTx);
        await transactionReceipt.wait();
        const hash = transactionReceipt.hash;
        const receipt = await provider.getTransactionReceipt(hash);
        return receipt;
    }

    async function getSales() {
        const salescontract = getContract();
        const result = await salescontract.getSales();
        console.log("Result from getSales:", result);
        var sales = [];
        result.forEach(sale => {
            sales.push(formatSale(sale));
        });
        return sales;
    }

    async function getSale(saleId) {
        const salescontract = getContract();
        const  result = await salescontract.getSalesById(saleId);
        return formatSale(result);
    }

    async function getSalesByUserId(userId) {
        const salescontract = getContract();
        const result = await salescontract.getSalesByUserId(userId);
        var sales = [];
        result.forEach(sale => {
            sales.push(formatSale(sale));
        });
        return sales;
    }

    function getContract() {
        const provider = new ethers.providers.JsonRpcProvider(API_URL);
        const salescontract = new ethers.Contract(
            SALES_CONTRACT, 
            contract.abi, 
            provider
        )
        return salescontract;
    }

    function formatSale(info) {
        let sale = {
            saleId:ethers.BigNumber.from(info[0]).toNumber(),
            userId:ethers.BigNumber.from(info[1]).toNumber(),
        }
        let items = [];
        info[2].forEach((element, index) => {
            let item = { name:element,price:ethers.BigNumber.from(info[3][index]).toNumber() }
            items.push(item);
        });
        sale.items = items;
        return sale;
        }
    
module.exports = {
    getSale: getSale,
    getSales: getSales,
    getSalesByUserId: getSalesByUserId,
    createSale: createSale
}