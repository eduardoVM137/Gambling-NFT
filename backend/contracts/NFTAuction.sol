// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAuction is Ownable {
    struct Auction {
        address seller; // Dirección del propietario del NFT
        address highestBidder; // Dirección del postor más alto
        uint256 highestBid; // Monto de la oferta más alta
        uint256 endTime; // Tiempo de finalización de la subasta
        uint256 tokenId; // ID del NFT en subasta
        bool ended; // Indica si la subasta ha finalizado
        string tokenURI; // URI del token o imagen asociada
    }

    IERC721 public nftContract; // Contrato NFT que se subasta
    mapping(uint256 => Auction) public auctions; // Subastas por tokenId
    mapping(address => uint256[]) public userActiveAuctions; // Subastas activas por usuario
    uint256[] public activeAuctions; // Lista de todas las subastas activas

    event AuctionCreated(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 endTime,
        string tokenURI
    );
    event HighestBidIncreased(address indexed bidder, uint256 amount, uint256 indexed tokenId);
    event AuctionEnded(address winner, uint256 amount, uint256 indexed tokenId);

    /**
     * @dev Constructor para inicializar el contrato NFTAuction.
     * @param _nftContractAddress Dirección del contrato NFT (ERC721).
     */
    constructor(address _nftContractAddress) {
        nftContract = IERC721(_nftContractAddress);
    }

    /**
     * @dev Crear una subasta para un NFT.
     * @param _tokenId ID del NFT que se subastará.
     * @param _duration Duración de la subasta en segundos.
     * @param _tokenURI URI del token o imagen asociada.
     */
    function createAuction(
        uint256 _tokenId,
        uint256 _duration,
        string memory _tokenURI
    ) external {
        require(auctions[_tokenId].seller == address(0), "El NFT ya esta en subasta");
        require(nftContract.ownerOf(_tokenId) == msg.sender, "No eres el propietario del NFT");

        // Transferir el NFT al contrato de subastas
        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        auctions[_tokenId] = Auction({
            seller: msg.sender,
            highestBidder: address(0),
            highestBid: 0,
            endTime: block.timestamp + _duration,
            tokenId: _tokenId,
            ended: false,
            tokenURI: _tokenURI
        });

        activeAuctions.push(_tokenId);
        userActiveAuctions[msg.sender].push(_tokenId);

        emit AuctionCreated(msg.sender, _tokenId, auctions[_tokenId].endTime, _tokenURI);
    }

    /**
     * @dev Realizar una oferta (puja) en la subasta de un NFT.
     * @param _tokenId ID del token en subasta.
     */
    function bid(uint256 _tokenId) external payable {
        Auction storage auction = auctions[_tokenId];

        require(block.timestamp < auction.endTime, "La subasta ha finalizado");
        require(msg.value > auction.highestBid, "La oferta debe ser mayor a la actual");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit HighestBidIncreased(msg.sender, msg.value, _tokenId);
    }

    /**
     * @dev Finalizar una subasta de NFT.
     * @param _tokenId ID del token en subasta.
     */
    function endAuction(uint256 _tokenId) external {
        Auction storage auction = auctions[_tokenId];

        require(block.timestamp >= auction.endTime, "La subasta aun no ha terminado");
        require(!auction.ended, "La subasta ya ha finalizado");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            // Transferir el NFT al mejor postor
            nftContract.transferFrom(address(this), auction.highestBidder, _tokenId);
            // Transferir los fondos al vendedor
            payable(auction.seller).transfer(auction.highestBid);
        } else {
            // No hubo ofertas, devolver el NFT al vendedor
            nftContract.transferFrom(address(this), auction.seller, _tokenId);
        }

        _removeFromActiveAuctions(_tokenId);
        _removeFromUserActiveAuctions(auction.seller, _tokenId);

        emit AuctionEnded(auction.highestBidder, auction.highestBid, _tokenId);
    }

    /**
     * @dev Obtener detalles completos de las subastas activas.
     * @return Array de structs de subastas activas.
     */
    function getActiveAuctionDetails() external view returns (Auction[] memory) {
        Auction[] memory details = new Auction[](activeAuctions.length);
        for (uint256 i = 0; i < activeAuctions.length; i++) {
            details[i] = auctions[activeAuctions[i]];
        }
        return details;
    }

    /**
     * @dev Eliminar un token de la lista de subastas activas.
     */
    function _removeFromActiveAuctions(uint256 _tokenId) internal {
        for (uint256 i = 0; i < activeAuctions.length; i++) {
            if (activeAuctions[i] == _tokenId) {
                activeAuctions[i] = activeAuctions[activeAuctions.length - 1];
                activeAuctions.pop();
                break;
            }
        }
    }

    /**
     * @dev Eliminar un token de la lista de subastas activas de un usuario.
     */
    function _removeFromUserActiveAuctions(address _user, uint256 _tokenId) internal {
        uint256[] storage userAuctions = userActiveAuctions[_user];
        for (uint256 i = 0; i < userAuctions.length; i++) {
            if (userAuctions[i] == _tokenId) {
                userAuctions[i] = userAuctions[userAuctions.length - 1];
                userAuctions.pop();
                break;
            }
        }
    }
}
