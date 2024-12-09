const express = require("express");
const salesController = require("../controllers/sales");
const router = express.Router();

// Ruta para registrar una venta
router.post("/", async (req, res) => {
    const { userId, items, prices } = req.body;
    try {
        const receipt = await salesController.insertSale(userId, items, prices);
        res.status(201).json(receipt);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la venta", details: error.message });
    }
});

// Ruta para obtener una venta por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await salesController.getSalesById(id);
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la venta", details: error.message });
    }
});

// Ruta para listar NFTs en el Marketplace
router.get("/marketplace", async (req, res) => {
    try {
        const nfts = await salesController.getMarketplaceNFTs(); // Controlador para obtener NFTs listados
        res.status(200).json(nfts);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los NFTs del marketplace", details: error.message });
    }
});

// Ruta para listar un NFT en el Marketplace
router.post("/list", async (req, res) => {
    const { tokenId, price, sellerAddress } = req.body;
    try {
        const receipt = await salesController.listNFT(tokenId, price, sellerAddress);
        res.status(201).json(receipt);
    } catch (error) {
        res.status(500).json({ error: "Error al listar el NFT", details: error.message });
    }
});

// Ruta para comprar un NFT en el Marketplace
router.post("/buy", async (req, res) => {
    const { tokenId, buyerAddress } = req.body;
    try {
        const receipt = await salesController.buyNFT(tokenId, buyerAddress);
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ error: "Error al comprar el NFT", details: error.message });
    }
});

module.exports = router;
