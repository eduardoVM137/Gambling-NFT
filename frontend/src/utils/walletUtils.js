export const connectWallet = async () => {
    if (!window.ethereum) {
        alert("MetaMask no está instalado. Por favor, instálalo.");
        return null;
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts[0]; // Devuelve la cuenta conectada
    } catch (error) {
        console.error("Error al conectar con MetaMask:", error);
        return null;
    }
};
