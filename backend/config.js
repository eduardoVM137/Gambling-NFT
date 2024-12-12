require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Comprobación de variables de entorno
console.log("SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);

// Cargar direcciones desde addresses.json
const addresses = JSON.parse(fs.readFileSync("./addresses.json"));

// Cargar ABIs desde los artefactos de Hardhat
const factoryABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTFactory.sol/NFTFactory.json")
).abi;

const chanceABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTChance.sol/NFTChance.json")
).abi;

const auctionABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/NFTAuction.sol/NFTAuction.json")
).abi;

const donationABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/DonationWallet.sol/DonationWallet.json")
).abi;

// Instanciar el proveedor con ethers v6
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Crear wallet con el provider
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Instanciar contratos
const factoryContract = new ethers.Contract(addresses.NFTFactory, factoryABI, wallet);
console.log("Dirección del contrato de subastas (NFTFactory):", addresses.NFTFactory);

const chanceContract = new ethers.Contract(addresses.NFTChance, chanceABI, wallet);
const auctionContract = new ethers.Contract(addresses.NFTAuction, auctionABI, wallet);
console.log("Dirección del contrato de subastas (NFTAuction):", addresses.NFTAuction);

const donationContract = new ethers.Contract(addresses.DonationWallet, donationABI, wallet);

module.exports = {
  factoryContract,
  chanceContract,
  auctionContract,
  donationContract,
  provider,
  wallet,
};
