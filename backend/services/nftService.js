const { nftContract, provider } = require('../config');

async function mintPack(numberOfCards) {
  const tx = await nftContract.mintPack(numberOfCards);
  return tx;
}

async function getUserNFTs(owner) {
  // Necesitamos iterar sobre todos los tokens y ver cuales pertenecen al owner
  // Esto es un ejemplo simple, en un entorno real deberías guardar índices o usar eventos.
  const totalBN = await nftContract.tokenCounter();
  const total = Number(totalBN); 
  const ownedTokens = [];
  for(let i=0; i<total; i++){
    const currentOwner = await nftContract.ownerOf(i).catch(()=>null);
    if(currentOwner && currentOwner.toLowerCase() === owner.toLowerCase()){
      const uri = await nftContract.tokenURI(i);
      ownedTokens.push({ tokenId: i, uri });
    }
  }
  return ownedTokens;
}

module.exports = {
  mintPack,
  getUserNFTs
};
