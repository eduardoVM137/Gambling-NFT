import React, { useState } from "react";
import "./styles/App.css";
import ImageCard from "./components/ImageCard";
import SideMenu from "./components/SideMenu";

const App = () => {
    const [images, setImages] = useState([]);
    const [revealed, setRevealed] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false); // Nuevo estado para la animación de finalización

    const fetchPack = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setImages([]);
        setRevealed(0);

        const response = await fetch("http://localhost:3000/api/pack");
        const data = await response.json();

        setImages(data);
        setIsLoading(false);
    };

    const revealNextCard = () => {
        if (isLoading || isFinalizing) return;

        if (revealed < images.length - 1) {
            setRevealed(revealed + 1);
        } else {
            finalizePack();
        }
    };

    const finalizePack = () => {
        setIsFinalizing(true); // Activa la animación de finalización
        setTimeout(() => {
            // Limpia el pack después de la animación
            setImages([]);
            setRevealed(0);
            setIsFinalizing(false);
        }, 1000); // Duración de la animación (1 segundo)
    };

    return (
        <div className="App">
            <SideMenu />
            <div className="main-content">
                <h1>Image Pack Randomizer</h1>
                {images.length === 0 ? (
                    <button onClick={fetchPack} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Get Pack"}
                    </button>
                ) : (
                    <button onClick={revealNextCard} disabled={isLoading || isFinalizing}>
                        {revealed < images.length - 1
                            ? "Reveal Next Card"
                            : isFinalizing
                            ? "Finalizing..."
                            : "Finalize Pack"}
                    </button>
                )}
                <div
                    className={`image-grid ${isFinalizing ? "finalizing" : ""}`}
                >
                    {images.slice(0, revealed + 1).map((image, index) => (
                        <ImageCard key={index} image={image} />
                    ))}
                </div>
             
            </div>
        </div>
    );
};

export default App;
