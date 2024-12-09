import React, { useState } from "react";
import { mintNFT } from "../api/api";

function MintNFT() {
    const [recipient, setRecipient] = useState("");
    const [tokenURI, setTokenURI] = useState("");
    const [message, setMessage] = useState("");

    const handleMint = async (e) => {
        e.preventDefault();
        try {
            const response = await mintNFT(recipient, tokenURI);
            setMessage(`NFT minted successfully. Transaction hash: ${response.txHash}`);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Mint NFT</h1>
            <form onSubmit={handleMint}>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Token URI"
                    value={tokenURI}
                    onChange={(e) => setTokenURI(e.target.value)}
                />
                <button type="submit">Mint NFT</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default MintNFT;
