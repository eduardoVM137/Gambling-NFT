const { ethers } = require("ethers");
const { auctionContract, wallet,factoryContract } = require("../config");


/**
 * Crear una nueva subasta.
 * @param {string} tokenId - ID del NFT que se subastará.
 * @param {number} duration - Duración de la subasta en segundos.
 * @param {string} imageUrl - URL de la imagen asociada al NFT.
 */
async function createAuction(tokenId, duration, imageUrl) {
  try {
    if (!tokenId || isNaN(tokenId)) {
      throw new Error("Token ID inválido");
    }
    if (!duration || isNaN(duration)) {
      throw new Error("Duración inválida");
    }
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("URL de la imagen inválida");
    }

    const owner = await factoryContract.ownerOf(tokenId);
    console.log(`El propietario del token ${tokenId} es: ${owner}`);

    const approvedAddress = await factoryContract.getApproved(tokenId);
    console.log(`Aprobado: ${approvedAddress}`);

    if (!approvedAddress || approvedAddress.toLowerCase() !== auctionContract.target.toLowerCase()) {
      console.log(`Aprobando el token ${tokenId} para el contrato de subastas...`);
      const approvalTx = await factoryContract.approve(auctionContract.target, tokenId);
      await approvalTx.wait();
      console.log(`Token ${tokenId} aprobado exitosamente.`);
    }

    // Crear la subasta con la URL de la imagen
    console.log(`Creando la subasta para el token ${tokenId} con URL de imagen ${imageUrl}...`);
    const tx = await auctionContract.createAuction(tokenId, duration, imageUrl, {
      gasLimit: 300000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    console.log("Subasta creada exitosamente:", tx.hash);
    return tx;
  } catch (error) {
    console.error("Error al crear subasta:", error.message);
    throw new Error("No se pudo crear la subasta.");
  }
}

/**
 * Realizar una puja (bid) en una subasta.
 * @param {string} tokenId - ID del NFT en subasta.
 * @param {string} amount - Monto en ETH para la puja.
 */
async function bid(tokenId, amount) {
  try {
    if (!tokenId || isNaN(tokenId)) {
      throw new Error("Token ID inválido");
    }
    if (!amount || isNaN(amount)) {
      throw new Error("Monto inválido");
    }

    const tx = await auctionContract.bid(tokenId, {
      value: ethers.parseEther(amount), // Convertir ETH a Wei
      gasLimit: 200000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al realizar la puja:", error.message);
    throw new Error("La puja falló.");
  }
}

/**
 * Finalizar una subasta.
 * @param {string} tokenId - ID del NFT en subasta.
 */
async function endAuction(tokenId) {
  try {
    if (!tokenId || isNaN(tokenId)) {
      throw new Error("Token ID inválido");
    }

    const tx = await auctionContract.endAuction(tokenId, {
      gasLimit: 200000, // Ajustar si es necesario
    });

    await tx.wait(); // Esperar confirmación de la transacción
    return tx;
  } catch (error) {
    console.error("Error al finalizar la subasta:", error.message);
    throw new Error("No se pudo finalizar la subasta.");
  }
}

/**
 * Obtener todas las subastas activas.
 * @returns {Promise<Array>} Lista de IDs de tokens en subasta activa.
 */
async function getActiveAuctions() {
  try {
    const activeAuctions = await auctionContract.getActiveAuctions();
    return activeAuctions.map((tokenId) => tokenId.toString()); // Convertir BigNumber a string
  } catch (error) {
    console.error("Error al obtener subastas activas:", error.message);
    throw new Error("No se pudieron obtener las subastas activas.");
  }
}
async function getActiveAuctionDetails() {
  try {
    const activeAuctions = await auctionContract.getActiveAuctionDetails(); // Asume que la función devuelve detalles completos de las subastas activas.

    return activeAuctions.map((auction) => ({
      seller: auction.seller,
      highestBidder: auction.highestBidder,
      highestBid: ethers.formatEther(auction.highestBid.toString()), // Convertir BigInt a string y formatear a ETH
      endTime: new Date(Number(auction.endTime) * 1000).toISOString(), // Convertir BigInt a número y luego a fecha ISO
      tokenId: auction.tokenId.toString(), // Convertir BigInt a string
      ended: auction.ended,
    }));
  } catch (error) {
    console.error("Error al obtener detalles de subastas activas:", error.message);
    throw new Error("No se pudieron obtener los detalles de las subastas activas.");
  }
}


/**
 * Obtener subastas activas de un usuario específico.
 * @param {string} userAddress - Dirección del usuario.
 * @returns {Promise<Array>} Lista de IDs de tokens en subasta activa del usuario.
 */
async function getUserActiveAuctions(userAddress) {
  try {
    if (!ethers.isAddress(userAddress)) {
      throw new Error("Dirección de usuario inválida");
    }

    const userAuctions = await auctionContract.getUserActiveAuctions(userAddress);
    return userAuctions.map((tokenId) => tokenId.toString()); // Convertir BigNumber a string
  } catch (error) {
    console.error("Error al obtener subastas del usuario:", error.message);
    throw new Error("No se pudieron obtener las subastas del usuario.");
  }
}

module.exports = {
  createAuction,
  bid,
  endAuction,
  getActiveAuctions,
  getUserActiveAuctions,getActiveAuctionDetails,
};
