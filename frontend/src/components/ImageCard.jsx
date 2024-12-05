import React from "react";

const ImageCard = ({ image }) => {
    return (
        <div className={`image-card ${image.rarity}`}>
            <img src={image.url} alt={image.name} />
            <p>{image.name}</p>
            <span>{image.rarity.toUpperCase()}</span>
        </div>
    );
};

export default ImageCard;
