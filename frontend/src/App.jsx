import React, { useState } from "react";
import "./styles/App.css";
import ImageCard from "./components/ImageCard";

const App = () => {
    const [images, setImages] = useState([]);

    const fetchPack = async () => {
        // Limpia el estado antes de obtener el nuevo pack
        setImages([]);

        // Espera los datos del servidor
        const response = await fetch("http://localhost:3000/api/pack");
        const data = await response.json();

        // Actualiza el estado con los nuevos datos
        setImages(data);
    };

    return (
        <div className="App">
            <h1>Image Pack Randomizer</h1>
            <button onClick={fetchPack}>Get Pack</button>
            <div className="image-grid">
                {images.map((image) => (
                    <ImageCard key={image.id} image={image} />
                ))}
            </div>
        </div>
    );
};

export default App;
