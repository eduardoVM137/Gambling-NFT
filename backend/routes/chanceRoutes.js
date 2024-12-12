const express = require("express");
const { tryToBuyNFT, setWinChance, setPricePerAttempt } = require("../services/chanceService");

const router = express.Router();

router.post("/try", async (req, res) => {
  const { imageUrl, amount } = req.body;
  try {
    const tx = await tryToBuyNFT(imageUrl, amount);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error al intentar ganar NFT:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/win-chance", async (req, res) => {
  const { newWinChance } = req.body;
  try {
    const tx = await setWinChance(newWinChance);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true });
  } catch (error) {
    console.error("Error al configurar la probabilidad:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/price", async (req, res) => {
  const { newPrice } = req.body;
  try {
    const tx = await setPricePerAttempt(newPrice);
    await tx.wait(); // Espera la confirmación de la transacción
    res.json({ success: true });
  } catch (error) {
    console.error("Error al configurar el precio por intento:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
