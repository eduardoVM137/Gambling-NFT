const { ethers } = require("ethers");
const { chanceContract, wallet ,factoryContract} = require("../config");

/**
 * Intentar ganar un NFT.
 * @param {string} imageUrl - URL de la imagen asociada al NFT.
 * @param {string} amount - Monto en ETH para el intento.
 */
async function tryToBuyNFT(imageUrl, amount) {
  try {
    if (!imageUrl) {
      throw new Error("URL de la imagen es requerida");
    }

    if (!amount || isNaN(amount)) {
      throw new Error("Monto inválido");
    }

    // Convertir ETH a Wei
    console.log("Dirección de NFTFactory en el backend:", factoryContract.target);
    const owner = await factoryContract.owner();
    console.log("Propietario del contrato NFTFactory:", owner);
    console.log("Dirección del contrato NFTChance:", chanceContract.target);
    
// const tx = await factoryContract.transferOwnership("0x366715896bf8D214b2F522338EaD0f75414971E6");// NFTChance adress
 //await tx.wait();
 //const ss = await factoryContract.transferOwnership(chanceContract.target);// NFTChance adress
// await ss.wait();

    let  amountInWei = ethers.parseEther(amount.toString());

     tx = await chanceContract.tryToBuyNFT(imageUrl, {
      value: amountInWei, // Usar el monto del usuario
      gasLimit: 300000, // Subimos el gasLimit
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al intentar ganar un NFT:", error.message);
    throw new Error("El intento falló.");
  }
}

/**
 * Configurar la probabilidad de ganar un NFT.
 * @param {number} newWinChance - Nueva probabilidad (por ejemplo, 1 de cada 3 intentos = 3).
 */
async function setWinChance(newWinChance) {
  try {
    if (!newWinChance || isNaN(newWinChance)) {
      throw new Error("Probabilidad inválida");
    }

    const tx = await chanceContract.setWinChance(newWinChance, {
      gasLimit: 100000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al configurar la probabilidad de ganar:", error.message);
    throw new Error("No se pudo configurar la probabilidad.");
  }
}

/**
 * Configurar el precio por intento.
 * @param {string} newPrice - Nuevo precio en ETH.
 */
async function setPricePerAttempt(newPrice) {
  try {
    if (!newPrice || isNaN(parseFloat(newPrice))) { // Validar número decimal
      throw new Error("Precio inválido");
    }

    // Convertir de ETH a Wei
    const newPriceInWei = ethers.parseUnits(newPrice.toString(), "ether");

    const tx = await chanceContract.setPricePerAttempt(newPriceInWei, {
      gasLimit: 300000, // Subimos el gasLimit
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al configurar el precio por intento:", error.message);
    throw new Error("No se pudo configurar el precio por intento.");
  }
}



module.exports = {
  tryToBuyNFT,
  setWinChance,
  setPricePerAttempt,
};
