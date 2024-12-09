// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//NFTCLASE es el nombre de la coleccion puede ser lo que sea cambiar despues
contract NFTClase is ERC721, Ownable { 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Strings for uint256;
    mapping(uint256 => string) private _tokenURIs;
    constructor() ERC721("NFTWaifu", "NFTWaifu") {}
    string private _baseURIextended;
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseURIextended = baseURI;
    }
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId),"ERC721Meta: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        string memory _tokenUri=_tokenURIs[tokenId];
        string memory base= _baseURI();
        if(bytes(base).length==0){
            return _tokenUri;
        }
        if(bytes(_tokenUri).length>0){
            return string(abi.encodePacked(base,_tokenUri));
        }
        return string(abi.encodePacked(base,tokenId.toString()));
    }
    //funcion para minar el nft
    function mintNFT(address recipient,string memory _tokenURI) public onlyOwner returns(uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId,_tokenURI);
        return newItemId;
    }

}