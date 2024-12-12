const express = require("express");
const {
    createAuction,
    bid,
    endAuction,
    getActiveAuctions,
    getActiveAuctionDetails,
    getUserActiveAuctions,
} = require("../services/auctionService");

const router = express.Router();

// Crear una subasta
router.post("/create", async (req, res) => {
  const { tokenId, duration, tokenURI } = req.body;
  try {
    const tx = await createAuction(tokenId, duration, tokenURI);
    await tx.wait(); // Esperar confirmación de la transacción
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al crear subasta:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// Realizar una oferta
router.post("/bid", async (req, res) => {
    const { tokenId, amount } = req.body;
    try {
        const tx = await bid(tokenId, amount);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("Error al realizar la oferta:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Finalizar una subasta
router.post("/end", async (req, res) => {
    const { tokenId } = req.body;
    try {
        const tx = await endAuction(tokenId);
        await tx.wait();
        res.json({ success: true });
    } catch (error) {
        console.error("Error al finalizar la subasta:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Obtener subastas activas
router.get("/active", async (req, res) => {
    try {
        const activeAuctions = await getActiveAuctions();
        res.json({ activeAuctions });
    } catch (error) {
        console.error("Error al obtener subastas activas:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Obtener detalles de subastas activas
router.get("/active-details", async (req, res) => {
    try {
        const activeAuctions = await getActiveAuctionDetails();
        res.json({ activeAuctions });
    } catch (error) {
        console.error("Error al obtener detalles de subastas activas:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Obtener subastas activas de un usuario
router.get("/user-active/:userAddress", async (req, res) => {
    const { userAddress } = req.params;
    try {
        const userAuctions = await getUserActiveAuctions(userAddress);
        res.json({ userAuctions });
    } catch (error) {
        console.error("Error al obtener subastas activas del usuario:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
