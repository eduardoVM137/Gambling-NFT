import React from "react";
import "../styles/SideMenu.css";

const SideMenu = ({ onSelect }) => {
    return (
        <div className="side-menu">
            <h2>Menu</h2>
            <ul>
    <li onClick={() => onSelect("pack")}>Open Packs</li>
    <li onClick={() => onSelect("coleccion")}>Coleccion</li>
    <li onClick={() => onSelect("sell")}>Sell Cards</li>
    <li onClick={() => onSelect("marketplace")}>Marketplace</li>
</ul>

        </div>
    );
};

export default SideMenu;



// import React from "react";
// import "../styles/SideMenu.css";


// const SideMenu = () => {
//     return (
//         <div className="side-menu">
//             <h2>Menu</h2>
//             <ul>
//                 <li>View Collection</li>
//                 <li>Open Packs</li>
//                 <li>Sell Cards</li>
//             </ul>
//         </div>
//     );
// };

// export default SideMenu;
