require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.9",
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/_HPPRZme3LxFN3Q680VGxbkmRUUU7Zpe",
            accounts: ["3a1c79fa2d975cd18b07256a3f51a5bb648b6787b3d01e8f3e2ddb0c92d41d32"],
        },
    },
};
