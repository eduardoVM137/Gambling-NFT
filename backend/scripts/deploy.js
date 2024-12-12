const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 1️⃣ **Desplegar NFTFactory**
  const NFTFactory = await ethers.getContractFactory("NFTFactory");
  const nftFactory = await NFTFactory.deploy();
  await nftFactory.waitForDeployment();
  console.log("NFTFactory deployed to:", await nftFactory.getAddress());

  // 2️⃣ **Desplegar NFTChance con la dirección de NFTFactory**
  const NFTChance = await ethers.getContractFactory("NFTChance");
  const nftChance = await NFTChance.deploy(await nftFactory.getAddress());
  await nftChance.waitForDeployment();
  console.log("NFTChance deployed to:", await nftChance.getAddress());

  // 3️⃣ **Desplegar NFTAuction con la dirección de NFTFactory**
  const NFTAuction = await ethers.getContractFactory("NFTAuction");
  const nftAuction = await NFTAuction.deploy(await nftFactory.getAddress());
  await nftAuction.waitForDeployment();
  console.log("NFTAuction deployed to:", await nftAuction.getAddress());

  // // 4️⃣ **Desplegar DonationWallet**   "DonationWallet": "0x69e272371c197acc6d17abb6B33bC7E00b2C6A60",
  // const DonationWallet = await ethers.getContractFactory("DonationWallet");
  // const donationWallet = await DonationWallet.deploy();
  // await donationWallet.waitForDeployment();
  // console.log("DonationWallet deployed to:", await donationWallet.getAddress());

  // Guardar direcciones de los contratos en un archivo JSON
  const addresses = {
    NFTFactory: await nftFactory.getAddress(),
    NFTChance: await nftChance.getAddress(),
    NFTAuction: await nftAuction.getAddress(),
    // DonationWallet: await donationWallet.getAddress(),
  };

  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  console.log("Deployment completed and addresses saved in addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
