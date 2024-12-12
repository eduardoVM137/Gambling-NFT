// import React, { useState, useEffect } from "react"; 
// import { useAPI } from "../hooks/useAPI";
// import ImageCard from "./ImageCard";
// import "../styles/MyCollection.css";

// const MyCollection = () => {
//   const [collection, setCollection] = useState([]);
//   const { fetchData, loading, error } = useAPI();

//   // Obtener la colección completa de NFTs del usuario
//   const fetchCollection = async () => {
//     try {
//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       const userAddress = accounts[0]; // Primera cuenta conectada

//       // Realizar la solicitud al endpoint con la dirección de la wallet
//       const result = await fetchData(`/factory/collection?userAddress=${userAddress}`, "GET");

//       if (result && result.nfts) {
//         setCollection(result.nfts); // Actualizar el estado con la colección
//       }
//     } catch (error) {
//       console.error("Error al cargar la colección:", error);
//     }
//   };

//   // Crear subasta para un NFT específico
//   const createAuction = async (tokenId, tokenURI) => {
//     try {
//       const duration = 36000; // Duración de la subasta en segundos
//       const result = await fetchData("/auction/create", "POST", { tokenId, duration, tokenURI });
//       if (result) alert(`Subasta creada con éxito: ${result.txHash}`);
//     } catch (error) {
//       console.error("Error al crear la subasta:", error);
//       alert("Hubo un problema al crear la subasta.");
//     }
//   };

//   useEffect(() => {
//     fetchCollection();
//   }, []);

//   return (
//     <div className="my-collection">
//       <h2>Mi Colección</h2>
//       {loading && <p>Cargando...</p>}
//       {error && <p className="error">{error}</p>}
//       <div className="collection-grid">
//         {collection.length > 0 ? (
//           collection.map((nft, index) => (
//             <ImageCard 
//               key={index} 
//               image={{
//                 url: nft.tokenURI,
//                 name: `NFT #${nft.tokenId}`,
//                 rarity: determineRarity(nft.tokenId),
//               }}
//               onAuction={() => createAuction(nft.tokenId, nft.tokenURI)} 
//             />
//           ))
//         ) : (
//           <p>No tienes NFTs en tu colección.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // Función para determinar la rareza
// const determineRarity = (tokenId) => {
//   const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
//   return rarities[tokenId % rarities.length];
// };

// export default MyCollection;



import React, { useState, useEffect } from "react";
import { useAPI } from "../hooks/useAPI";

const MyCollection = () => {
  const [collection, setCollection] = useState([]);
  const { fetchData, loading, error } = useAPI();

  // Obtener la colección completa de NFTs del usuario
  const fetchCollection = async () => {
    try {
      // Conectar con MetaMask y obtener la cuenta actual
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = accounts[0]; // Primera cuenta conectada
  
      // Realizar la solicitud al endpoint con la dirección de la wallet
      const result = await fetchData(`/factory/collection?userAddress=${userAddress}`, "GET");
  
      if (result && result.nfts) {
        setCollection(result.nfts); // Actualizar el estado con la colección
      }
    } catch (error) {
      console.error("Error al cargar la colección:", error);
    }
  };

  // Crear subasta para un NFT específico
  const createAuction = async (tokenId, tokenURI) => {
    try {
      if (!tokenURI) {
        alert("No se encontró la URL de la imagen del NFT.");
        return;
      }

      const duration = 36000; // Duración de la subasta (por ejemplo, 10 horas = 36000 segundos)
      const result = await fetchData("/auction/create", "POST", { tokenId, duration, tokenURI });

      if (result) {
        alert(`Subasta creada con éxito: ${result.txHash}`);
      }
    } catch (error) {
      console.error("Error al crear la subasta:", error);
      alert("No se pudo crear la subasta.");
    }
  };

  const handleCreateAuction = (tokenId, tokenURI) => {
    if (!tokenURI) {
      alert("No se encontró la URL de la imagen del NFT.");
      return;
    }
    createAuction(tokenId, tokenURI);
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div className="my-collection">
      <h2>Mi Colección</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      <div className="collection-grid">
        {collection.length > 0 ? (
          collection.map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} />
              <p><strong>ID NFT:</strong> {nft.tokenId}</p>
              <p><strong>Dueño:</strong> {nft.owner}</p>
              <button onClick={() => handleCreateAuction(nft.tokenId, nft.tokenURI)}>Subastar</button>
            </div>
          ))
        ) : (
          <p>No tienes NFTs en tu colección.</p>
        )}
      </div>
    </div>
  );
};

export default MyCollection;
