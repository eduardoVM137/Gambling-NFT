const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const users = await userController.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
    }
});

// Ruta para crear un nuevo usuario
router.post("/", async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
        const receipt = await userController.createUser(firstName, lastName);
        res.status(201).json(receipt);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el usuario", details: error.message });
    }
});

// Ruta para obtener un usuario por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userController.getUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
});

module.exports = router;
