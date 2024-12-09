const express = require("express");
const images = require("../data/images.json");

const router = express.Router();

function getRandomImages() {
    const rarities = {
        common: 0.5,
        uncommon: 0.3,
        rare: 0.15,
        epic: 0.04,
        legendary: 0.01,
    };

    const result = [];
    const packDistribution = ["common", "common", "uncommon", "rare", "epic"];
    const shuffledDistribution = packDistribution.sort(() => Math.random() - 0.5);

    shuffledDistribution.forEach((rarity) => {
        const options = images.filter((img) => img.rarity === rarity);
        const randomImage = options[Math.floor(Math.random() * options.length)];
        result.push(randomImage);
    });

    return result;
}

router.get("/", (req, res) => {
    const pack = getRandomImages();
    res.json(pack);
});

module.exports = router;
