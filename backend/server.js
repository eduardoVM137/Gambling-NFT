const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Image data
const images = require("./data/images.json");

// Helper to select balanced random images
function getRandomImages() {
    const rarities = {
        common: 0.5,
        uncommon: 0.3,
        rare: 0.15,
        epic: 0.04,
        legendary: 0.01,
    };

    const result = [];
    const rarityCounts = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
    };

    // Define how many of each rarity to include in the pack
    const packDistribution = [
        "common",
        "common",
        "uncommon",
        "rare",
        "epic", // Adjust this distribution as needed
    ];

    // Shuffle the distribution array
    const shuffledDistribution = packDistribution.sort(() => Math.random() - 0.5);

    shuffledDistribution.forEach((rarity) => {
        const options = images.filter((img) => img.rarity === rarity);
        const randomImage = options[Math.floor(Math.random() * options.length)];
        result.push(randomImage);
        rarityCounts[rarity]++;
    });

    return result;
}

// API route
app.get("/api/pack", (req, res) => {
    const pack = getRandomImages();
    res.json(pack);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
