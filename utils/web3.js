import { ethers } from 'ethers';
import { FILECOIN_TESTNET_CONFIG } from '../constants/networkConfig';

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // 请求切换到 Filecoin 测试网
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [FILECOIN_TESTNET_CONFIG],
      });

      // 请求账户连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      return accounts[0];
    } catch (err) {
      throw new Error('Failed to connect wallet');
    }
  } else {
    throw new Error('Please install MetaMask');
  }
};

export const getContract = async (address, abi) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};