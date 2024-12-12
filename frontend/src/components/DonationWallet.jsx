import React, { useState } from "react";
import { useAPI } from "../hooks/useAPI";

const DonationWallet = () => {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const { fetchData, loading, error } = useAPI();

  const donate = async () => {
    const result = await fetchData("/donations/donate", "POST", { amount });
    if (result) alert(`Donación exitosa: ${result.txHash}`);
  };

  const getBalance = async () => {
    const result = await fetchData("/donations/balance", "GET");
    if (result) alert(`Balance: ${result.balance} ETH`);
  };

  const withdrawFunds = async () => {
    const result = await fetchData("/donations/withdraw", "POST", { to: toAddress, amount: withdrawAmount });
    if (result) alert(`Fondos retirados: ${result.txHash}`);
  };

  return (
    <div className="donation-wallet">
      <h2>Donar</h2>
      <input
        type="number"
        placeholder="ETH a donar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={donate} disabled={loading}>Donar</button>
      <button onClick={getBalance} disabled={loading}>Ver Balance</button>
      <h2>Retirar Fondos</h2>
      <input
        type="text"
        placeholder="Dirección de destino"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="ETH a retirar"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <button onClick={withdrawFunds} disabled={loading}>Retirar Fondos</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DonationWallet;
