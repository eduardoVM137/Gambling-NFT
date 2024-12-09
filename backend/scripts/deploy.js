const { ethers } = require("hardhat");
/* async function main() {
    //cambiando el valor entre comillas se elige el contrato a hacer deploy
    const NFT = await ethers.getContractFactory("Sales");
    const nfts = await NFT.deploy();
    const txHash = nfts.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to address:", txReceipt.contractAddress);
}

main().then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1);
}) */

//codigo deploy wallet
async function multiDeploy() {
    const owners = ["0x5113F1e03A11Fb4e25Ad8906CF3B36F79f731095","0x5b74A331d1F0f46307107A73444404CEFADaDB0A"];
    const requiredApprovals = 2;
    const WalletMultiSig = await ethers.getContractFactory("WalletMultiSig");
    const wallet = await WalletMultiSig.deploy(owners, requiredApprovals);
    console.log("WalletMultiSig deployed to: ", wallet.address);
}

multiDeploy().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})

