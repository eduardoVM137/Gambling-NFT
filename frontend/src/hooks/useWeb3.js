import { useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";

const useWeb3 = () => {
  const [account, setAccount] = useState(null);

  useEffect(()=>{
    init();
  },[]);

  const init = async () => {
    const provider = await detectEthereumProvider();
    if(provider) {
      const accounts = await window.ethereum.request({ method:'eth_requestAccounts' });
      setAccount(accounts[0]);
      window.ethereum.on('accountsChanged', (accs) => {
        setAccount(accs[0]);
      });
    }
  }

  return { account };
}

export default useWeb3;
