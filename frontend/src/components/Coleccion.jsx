import React, { useEffect, useState } from "react";
import { connectWallet } from "../utils/walletUtils";

const Coleccion = () => {
    const [nfts, setNfts] = useState([]); // NFTs disponibles en el marketplace
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Obtener la lista de NFTs desde el backend
        const fetchNFTs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:3000/api/wallet/transactions");
                const data = await response.json();
                setNfts(data);
            } catch (error) {
                console.error("Error fetching NFTs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNFTs();
    }, []);

    const buyNFT = async (tokenId, price) => {
        const userAddress = await connectWallet();
        if (!userAddress) return;

        try {
            const transaction = {
                to: "SALES_CONTRACT_ADDRESS", // Reemplaza con la dirección del contrato de ventas
                value: ethers.utils.parseEther(price.toString()).toHexString(),
            };

            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transaction],
            });

            alert(`¡Compra completada! Token ID: ${tokenId}`);
        } catch (error) {
            console.error("Error al comprar NFT:", error);
        }
    };

    return (
        <div className="marketplace">
            <h1>Marketplace</h1>
            {isLoading ? (
                <p>Cargando NFTs...</p>
            ) : nfts.length === 0 ? (
                <p>No hay NFTs listados en este momento.</p>
            ) : (
                <div className="nft-list">
                    {nfts.map((nft) => (
                        <div key={nft.tokenId} className="nft-card">
                            <img src={nft.image} alt={nft.name} />
                            <h3>{nft.name}</h3>
                            <p>Precio: {nft.price} ETH</p>
                            <button onClick={() => buyNFT(nft.tokenId, nft.price)}>
                                Comprar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Coleccion;
