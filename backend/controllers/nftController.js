require('dotenv').config({ path: require('find-config')('.env') });
const { ethers } = require('ethers');
const contract = require('../artifacts/contracts/NFTcontract.sol/NFTClase.json');

const { API_URL, PRIVATE_KEY, NFT_CONTRACT } = process.env;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(NFT_CONTRACT, contract.abi, wallet);

async function mintNFT(recipient, tokenURI) {
    const tx = await nftContract.mintNFT(recipient, tokenURI);
    await tx.wait();
    return { transactionHash: tx.hash, recipient, tokenURI };
}

async function getMetadata(tokenId) {
    const metadata = await nftContract.tokenURI(tokenId);
    return { tokenId, metadata };
}

module.exports = { mintNFT, getMetadata };
