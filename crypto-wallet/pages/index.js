import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [tokenBalances, setTokenBalances] = useState([]);

  // ERC-20 Token Contract Addresses
  const tokenContracts = [
    { name: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
    { name: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  ];

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
    } else {
      alert('Please install MetaMask!');
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      fetchBalances(accounts[0]);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const fetchBalances = async (address) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));

      const tokenBalancePromises = tokenContracts.map(async (token) => {
        const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const balance = await tokenContract.balanceOf(address);
        return {
          name: token.name,
          balance: ethers.utils.formatUnits(balance, token.decimals),
        };
      });

      const resolvedTokenBalances = await Promise.all(tokenBalancePromises);
      setTokenBalances(resolvedTokenBalances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crypto Wallet Balance</h1>
      {!walletAddress ? (
        <button style={styles.button} onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          <p>Balance: {balance} ETH</p>
          <h2>Token Balances:</h2>
          <ul>
            {tokenBalances.map((token, index) => (
              <li key={index}>{token.name}: {token.balance}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#282c34',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '5px',
  }
};
