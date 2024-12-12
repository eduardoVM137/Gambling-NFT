import React, { useState, useEffect } from "react";
import { useAPI } from "../hooks/useAPI";
import imagesData from "../utils/images.json"; // Importar el archivo JSON

const BuyPacks = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(""); // Almacena la dirección de la cuenta de Metamask
  const [testImage, setTestImage] = useState(null); // Almacena la imagen de prueba
  const { fetchData, loading, error } = useAPI();

  // Conectar Metamask y obtener la dirección de la cuenta
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error al conectar con Metamask:", error);
      }
    } else {
      alert("Metamask no está instalado. Por favor, instala Metamask.");
    }
  };

  // Conecta la wallet al cargar el componente
  useEffect(() => {
    connectWallet();
  }, []);

  // Función para obtener una URL de imagen aleatoria basada en la rareza
  const getRandomImageUrl = () => {
    const rarityWeights = {
      comun: 60, // 60% de probabilidad
      'no-comun': 25, // 25% de probabilidad
      rara: 10, // 10% de probabilidad
      epica: 4,  // 4% de probabilidad
      legendaria: 1 // 1% de probabilidad
    };

    // Generar un número aleatorio entre 0 y 100
    const randomValue = Math.random() * 100;
    let accumulatedProbability = 0;

    // Determinar la rareza según la probabilidad
    let selectedRarity = 'comun';
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      accumulatedProbability += weight;
      if (randomValue <= accumulatedProbability) {
        selectedRarity = rarity;
        break;
      }
    }

    // Filtrar las imágenes por la rareza seleccionada
    const filteredImages = imagesData.filter(image => image.rarity === selectedRarity);
    const randomIndex = Math.floor(Math.random() * filteredImages.length);

    return filteredImages[randomIndex];
  };

  const tryToBuyNFT = async () => {
    if (!account) {
      alert("Por favor, conecta tu wallet de Metamask.");
      return;
    }
    const selectedImage = getRandomImageUrl();
    setImageUrl(selectedImage.url);
    const result = await fetchData("/chance/try", "POST", { imageUrl: selectedImage.url, amount });
    if (result) alert(`Intento exitoso: ${result.txHash}`);
  };

  const mintNFT = async () => {
    if (!account) {
      alert("Por favor, conecta tu wallet de Metamask.");
      return;
    }
    const selectedImage = getRandomImageUrl();
    setImageUrl(selectedImage.url);
    const result = await fetchData("/factory/mint", "POST", { recipient: account, tokenURI: selectedImage.url });
    if (result) alert(`NFT creado exitosamente: ${result.txHash}`);
  };

  const testRandomCard = () => {
    const selectedImage = getRandomImageUrl();
    console.log(selectedImage);
    setTestImage(selectedImage);
  };

  return (
    <div className="buy-packs">
      <h2>Comprar Chance</h2>

      <div>
        {account ? (
          <p>Wallet conectada: <strong>{account}</strong></p>
        ) : (
          <button onClick={connectWallet}>Conectar Wallet</button>
        )}
      </div>

      <input
        type="number"
        placeholder="ETH a gastar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={tryToBuyNFT} disabled={loading || !account}>
        {loading ? "Cargando..." : "Intentar ganar NFT"}
      </button>
      <button onClick={mintNFT} disabled={loading || !account}>
        {loading ? "Cargando..." : "Crear NFT directamente"}
      </button>

      <button onClick={testRandomCard} disabled={loading}>
        Probar carta
      </button>

      {testImage && (
        <div style={{ marginTop: '20px' }}>
          <h4>Carta de prueba:</h4>
          <p><strong>Rareza:</strong> {testImage.rarity}</p>
          <img src={testImage.url} alt="NFT" style={{ width: '200px', marginTop: '10px' }} />
        </div>
      )}

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Última carta ganada:</h4>
          <img src={imageUrl} alt="NFT" style={{ width: '200px', marginTop: '20px' }} />
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default BuyPacks;
