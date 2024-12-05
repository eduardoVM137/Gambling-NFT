import React from "react";
import "../styles/SideMenu.css";


const SideMenu = () => {
    return (
        <div className="side-menu">
            <h2>Menu</h2>
            <ul>
                <li>View Collection</li>
                <li>Open Packs</li>
                <li>Sell Cards</li>
            </ul>
        </div>
    );
};

export default SideMenu;
