const express = require("express");
const nftController = require("../controllers/nft"); // Asegúrate de que este archivo existe y tiene las funciones necesarias

const router = express.Router();

// Rutas relacionadas con NFTs
router.get("/metadata/:tokenId", async (req, res) => {
    try {
        const metadata = await nftController.getMetadata(req.params.tokenId);
        res.status(200).json(metadata);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo metadata", details: error.message });
    }
});

router.post("/mint", async (req, res) => {
    const { recipient, tokenURI } = req.body;
    try {
        const receipt = await nftController.mintNFT(recipient, tokenURI);
        res.status(201).json(receipt);
    } catch (error) {
        res.status(500).json({ error: "Error minting NFT", details: error.message });
    }
});

module.exports = router;

// const express = require("express");
// const nftController = require("../controllers/nft");

// const router = express.Router();

// // Crear un nuevo NFT
// router.post("/mint", async (req, res) => {
//     const { userAddress } = req.body;
//     try {
//         const txHash = await nftController.mintNFT(userAddress);
//         res.status(201).json({ txHash });
//     } catch (error) {
//         res.status(500).json({ error: "Error al crear el NFT", details: error.message });
//     }
// });

// // Obtener NFTs de un usuario
// router.get("/:owner", async (req, res) => {
//     const { owner } = req.params;
//     try {
//         const tokens = await nftController.getNFTsByOwner(owner);
//         res.status(200).json(tokens);
//     } catch (error) {
//         res.status(500).json({ error: "Error al obtener NFTs", details: error.message });
//     }
// });

// // Transferir un NFT
// router.post("/transfer", async (req, res) => {
//     const { from, to, tokenId } = req.body;
//     try {
//         const txHash = await nftController.transferNFT(from, to, tokenId);
//         res.status(200).json({ txHash });
//     } catch (error) {
//         res.status(500).json({ error: "Error al transferir NFT", details: error.message });
//     }
// });

// module.exports = router;
