import React from "react";
import "../styles/SideMenu.css";

const SideMenu = ({ onSelect }) => {
    return (
        <div className="side-menu">
            <h2>Menu</h2>
            <ul>
    <li onClick={() => onSelect("buypacks")}>Jugar Waifu-Gacha</li>
    <li onClick={() => onSelect("coleccion")}>Coleccion</li>
    <li onClick={() => onSelect("subastas")}>Subastas</li>
    <li onClick={() => onSelect("donation")}>Donaciones</li> 
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
