const express = require("express");
const wallet = require("../controllers/wallet.js"); // Tu archivo actual "wallet.js"

const router = express.Router();

// Ruta para enviar transacciones
router.post("/submit", async (req, res) => {
    const { to, amount } = req.body;

    if (!to || !amount) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios: 'to' o 'amount'." });
    }

    try {
        const receipt = await wallet.SubmitTransaction(to, amount);
        res.status(200).json({ success: true, receipt });
    } catch (error) {
        res.status(500).json({ error: "Error al enviar la transacción", details: error.message });
    }
});

// Ruta para aprobar una transacción
router.post("/approve", async (req, res) => {
    const { idTransaction } = req.body;

    if (idTransaction === undefined) {
        return res.status(400).json({ error: "Falta el parámetro obligatorio: 'idTransaction'." });
    }

    try {
        const receipt = await wallet.submitApproval(idTransaction);
        res.status(200).json({ success: true, receipt });
    } catch (error) {
        res.status(500).json({ error: "Error al aprobar la transacción", details: error.message });
    }
});

// Ruta para ejecutar una transacción
router.post("/execute", async (req, res) => {
    const { idTransaction } = req.body;

    if (idTransaction === undefined) {
        return res.status(400).json({ error: "Falta el parámetro obligatorio: 'idTransaction'." });
    }

    try {
        const receipt = await wallet.executeTransaction(idTransaction);
        res.status(200).json({ success: true, receipt });
    } catch (error) {
        res.status(500).json({ error: "Error al ejecutar la transacción", details: error.message });
    }
});

// Ruta para obtener todas las transacciones
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await wallet.getTransactions();
    
        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener las transacciones",
            details: error.message,
        });
    }
});

// Ruta para realizar un depósito
router.post("/deposit", async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Falta el parámetro obligatorio: 'amount'." });
    }

    try {
        await wallet.Deposit(amount);
        res.status(200).json({ success: true, message: "Depósito realizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al realizar el depósito", details: error.message });
    }
});

module.exports = router;
