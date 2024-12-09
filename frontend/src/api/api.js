const API_BASE_URL = "http://localhost:3000/api";

// Usuarios
export async function fetchUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error("Error fetching users");
        return await response.json();
    } catch (error) {
        console.error("Fetch Users Error:", error);
        throw error;
    }
}

export async function createUser(firstName, lastName) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName }),
        });
        if (!response.ok) throw new Error("Error creating user");
        return await response.json();
    } catch (error) {
        console.error("Create User Error:", error);
        throw error;
    }
}

// NFTs
export async function mintNFT(recipient, tokenURI) {
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/mint`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipient, tokenURI }),
        });
        if (!response.ok) throw new Error("Error minting NFT");
        return await response.json();
    } catch (error) {
        console.error("Mint NFT Error:", error);
        throw error;
    }
}

export async function getTokenURI(tokenId) {
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/${tokenId}`);
        if (!response.ok) throw new Error("Error fetching token URI");
        return await response.json();
    } catch (error) {
        console.error("Get Token URI Error:", error);
        throw error;
    }
}

// Packs
export async function fetchPack(userAddress) {
    try {
        const response = await fetch(`${API_BASE_URL}/pack`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userAddress }),
        });
        if (!response.ok) throw new Error("Error fetching pack");
        return await response.json();
    } catch (error) {
        console.error("Fetch Pack Error:", error);
        throw error;
    }
}

// Marketplace
export async function fetchMarketplace() {
    try {
        const response = await fetch(`${API_BASE_URL}/sales/marketplace`);
        if (!response.ok) throw new Error("Error fetching marketplace data");
        return await response.json();
    } catch (error) {
        console.error("Fetch Marketplace Error:", error);
        throw error;
    }
}

export async function listNFT(tokenId, price, sellerAddress) {
    try {
        const response = await fetch(`${API_BASE_URL}/sales/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokenId, price, sellerAddress }),
        });
        if (!response.ok) throw new Error("Error listing NFT");
        return await response.json();
    } catch (error) {
        console.error("List NFT Error:", error);
        throw error;
    }
}

export async function buyNFT(tokenId, buyerAddress) {
    try {
        const response = await fetch(`${API_BASE_URL}/sales/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokenId, buyerAddress }),
        });
        if (!response.ok) throw new Error("Error buying NFT");
        return await response.json();
    } catch (error) {
        console.error("Buy NFT Error:", error);
        throw error;
    }
}
