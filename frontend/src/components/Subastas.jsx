import React, { useState, useEffect } from "react";
import { useAPI } from "../hooks/useAPI";
import "../styles/Subastas.css";

const Subastas = () => {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [modal, setModal] = useState({ show: false, message: "", type: "" });
  const { fetchData, loading, error } = useAPI();

  const fetchActiveAuctions = async () => {
    try {
      const result = await fetchData("/auction/active-details", "GET");
      if (result && result.activeAuctions) {
        const now = Date.now();
        const filteredAuctions = result.activeAuctions.filter(
          (auction) => new Date(auction.endTime).getTime() > now && !auction.ended
        );

        // Obtener los tokenURI para cada subasta activa
        const auctionsWithImages = await Promise.all(
          filteredAuctions.map(async (auction) => {
            const tokenURIResult = await fetchData(`/factory/token-uri/${auction.tokenId}`, "GET");
            return {
              ...auction,
              tokenURI: tokenURIResult.tokenURI,
            };
          })
        );

        setActiveAuctions(auctionsWithImages);
      }
    } catch (error) {
      console.error("Error al cargar las subastas activas:", error);
    }
  };

  useEffect(() => {
    fetchActiveAuctions();
  }, []);

  const formatTimeRemaining = (endTime) => {
    const timeLeft = new Date(endTime) - new Date();
    if (timeLeft <= 0) return "Finalizado";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAuctions((prevAuctions) =>
        prevAuctions.map((auction) => ({
          ...auction,
          timeLeft: formatTimeRemaining(auction.endTime),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAuctions]);

  const handleBid = async (tokenId) => {
    const amount = prompt("Ingrese su oferta en ETH:");
    if (!amount) return;

    try {
      const result = await fetchData("/auction/bid", "POST", { tokenId, amount });
      if (result) {
        setModal({
          show: true,
          message: `¡Puja realizada con éxito! TxHash: ${result.txHash}`,
          type: "success",
        });
      }
    } catch (err) {
      console.error("Error al realizar la puja:", err);
      setModal({
        show: true,
        message: "Error al realizar la puja. Inténtalo de nuevo.",
        type: "error",
      });
    }
  };

  const closeModal = () => setModal({ show: false, message: "", type: "" });

  return (
    <div>
        <h2 className="auction-header">Subastas Activas</h2>
        <div className="auctions-container">
            {loading && <p>Cargando subastas...</p>}
            {error && <p>Error: {error}</p>}
            {activeAuctions.length > 0 ? (
          activeAuctions.map((auction) => (
            <div key={auction.tokenId} className="auction-card">
              <img src={auction.tokenURI} alt={`NFT ${auction.tokenId}`} className="auction-image" />
              <h3>Vendedor:</h3>
              <p className="wallet-address">{auction.seller}</p>
              <h3>Postor más alto:</h3>
              <p className="wallet-address">{auction.highestBidder}</p>
              <p>Oferta más alta: {auction.highestBid} ETH</p>
              <p className="countdown">Finaliza en: {formatTimeRemaining(auction.endTime)}</p>
              <p>ID del NFT: {auction.tokenId}</p>
              <button onClick={() => handleBid(auction.tokenId)}>Pujar</button>
            </div>
          ))
        ) : (
                <p>No hay subastas activas en este momento.</p>
            )}
        </div>
        {modal.show && (
            <div className={`modal ${modal.type}`}>
                <div className="modal-content">
                    <p>{modal.message}</p>
                    <button onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        )}
    </div>
);

};

export default Subastas;
