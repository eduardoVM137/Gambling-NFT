import React from "react";
import "../styles/ImageCard.css";


const ImageCard = ({ image }) => {
    return (
        <div className={`image-card animate-${image.rarity}`}>
            <img src={image.url} alt={image.name} />
            <p>{image.name}</p>
            <span>{image.rarity.toUpperCase()}</span>
        </div>
    );
};

export default ImageCard;
