import React from "react";
import "../styles/ImageCard.css";

const ImageCard = ({ image, onAuction }) => {
    return (
        <div className={`image-card animate-${image.rarity}`}>
            <img src={image.url} alt={image.name} />
            <p>{image.name}</p>
            <span>{image.rarity.toUpperCase()}</span>
            <button onClick={onAuction}>Subastar</button>
        </div>
    );
};

export default ImageCard;
