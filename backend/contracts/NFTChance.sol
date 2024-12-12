// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./NFTFactory.sol";

contract NFTChance {
    address public owner;
    uint256 public pricePerNFT = 0.0001 ether; // Precio fijo por NFT
    uint256 public pricePerAttempt = 0.0001 ether; // Precio por intento
    uint256 public winChance = 1; // 1 de cada 3 intentos gana
    NFTFactory public nftFactory; // Referencia al contrato NFTFactory

    using Strings for uint256;
    event Attempt(address indexed user, bool success, string message);
    event NFTCreated(address indexed user, uint256 tokenId);
    event NFTPurchased(address indexed buyer, uint256 tokenId, string message);

    constructor(address _nftFactoryAddress) {
        owner = msg.sender;
        nftFactory = NFTFactory(_nftFactoryAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    /**
     * @dev Permite a los usuarios comprar un NFT directamente.
     * @param _imageUrl URL de la imagen que será asociada al NFT.
     */
    function buyNFT(string memory _imageUrl) external payable {
        require(msg.value >= pricePerNFT, "Monto insuficiente para comprar el NFT");

        // Acuñar el NFT directamente usando NFTFactory
        uint256 tokenId = nftFactory.mintNFT(msg.sender, _imageUrl);
        
        emit NFTPurchased(msg.sender, tokenId, "Has comprado un NFT con exito");
    }

    /**
     * @dev Permite a los usuarios intentar ganar un NFT.
     * @param _imageUrl URL de la imagen que será asociada al NFT si el usuario gana.
     */
    function tryToBuyNFT(string memory _imageUrl) external payable {
        require(msg.value >= pricePerAttempt, "Monto insuficiente para intentar");

        // Generar un número aleatorio para determinar si el usuario gana
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number - 1)))) % winChance;

        if (randomNumber == 0) {
            // El usuario gana el NFT
            uint256 tokenId = nftFactory.mintNFT(msg.sender, _imageUrl);
            emit NFTCreated(msg.sender, tokenId);
            emit Attempt(msg.sender, true, "Felicidades, ganaste un NFT");
        } else {
            // El usuario pierde
            emit Attempt(msg.sender, false, "Intentalo de nuevo");
        }
    }

    /**
     * @dev Cambia el precio para comprar un NFT directamente.
     * @param _newPrice Nuevo precio por NFT en wei.
     */
    function setPricePerNFT(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "El precio debe ser mayor a 0");
        pricePerNFT = _newPrice;
    }

    /**
     * @dev Cambia el precio por intento.
     * @param _newPrice Nuevo precio por intento en wei.
     */
    function setPricePerAttempt(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "El precio debe ser mayor a 0");
        pricePerAttempt = _newPrice;
    }

    /**
     * @dev Cambia la probabilidad de ganar.
     * @param _newWinChance Nueva probabilidad de ganar (por ejemplo, 1 de cada 5 intentos = 5).
     */
    function setWinChance(uint256 _newWinChance) external onlyOwner {
        require(_newWinChance > 0, "La probabilidad debe ser mayor a 0");
        winChance = _newWinChance;
    }

    /**
     * @dev Retira los fondos acumulados en el contrato.
     * @param _to Dirección a la que se enviarán los fondos.
     */
    function withdrawFunds(address payable _to) external onlyOwner {
        require(address(this).balance > 0, "No hay fondos para retirar");
        _to.transfer(address(this).balance);
    }

    /**
     * @dev Obtiene el balance actual del contrato.
     * @return El balance actual del contrato en wei.
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
