import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './nft/NFTCard';

// 添加 Polygon zkEVM Cardona 测试网配置
const POLYGON_ZKEVM_CONFIG = {
  chainId: '0x98a', // 2442
  chainName: 'Polygon zkEVM Cardona Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rpc.cardona.zkevm-rpc.com'],
  blockExplorerUrls: ['https://cardona-zkevm.polygonscan.com']
};

const NFTInterface = ({ factoryAddress, factoryABI, collectionABI }) => {
  const [account, setAccount] = useState('');
  const [factoryContract, setFactoryContract] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');
  const [uploadedIPFSHash, setUploadedIPFSHash] = useState('');
  
  const [newCollection, setNewCollection] = useState({
    name: '',
    symbol: '',
    maxSupply: '0',
    mintPrice: '0.01'
  });

  // 添加切换网络的函数
  const switchToPolygonZkEVM = async () => {
    if (!window.ethereum) return false;
    
    try {
      // 尝试切换到 Polygon zkEVM 网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_ZKEVM_CONFIG.chainId }],
      });
      return true;
    } catch (switchError) {
      // 如果网络不存在，则添加网络
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_ZKEVM_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          setError('Failed to add Polygon zkEVM network: ' + (addError.message || 'Unknown error'));
          return false;
        }
      } else {
        console.error('Failed to switch network:', switchError);
        setError('Failed to switch network: ' + (switchError.message || 'Unknown error'));
        return false;
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // 首先切换到 Polygon zkEVM 网络
        const networkSwitched = await switchToPolygonZkEVM();
        if (!networkSwitched) {
          throw new Error('Please switch to Polygon zkEVM Cardona Testnet');
        }

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('Connected account:', accounts[0]);
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // 检查当前网络
        const network = await provider.getNetwork();
        if (network.chainId.toString() !== parseInt(POLYGON_ZKEVM_CONFIG.chainId, 16).toString()) {
          throw new Error('Please connect to Polygon zkEVM Cardona Testnet');
        }
        
        const factory = new ethers.Contract(
          factoryAddress,
          factoryABI,
          signer
        );
        
        setFactoryContract(factory);
        setError('');
        return true;
      } catch (err) {
        console.error('Connection error:', err);
        setError('Failed to connect: ' + (err.message || 'Unknown error'));
        return false;
      }
    } else {
      setError('Please install MetaMask');
      return false;
    }
  };

  const uploadToIPFS = async (file) => {
    setUploading(true);
    setTransactionStatus('Uploading to IPFS...');
    try {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      
      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: imageFormData
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      const imageData = await imageResponse.json();
      // 使用 Pinata 网关
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;
      
      const metadata = {
        name: `NFT #${Date.now()}`,
        description: "A Collection NFT token",
        image: imageUrl,
        attributes: []
      };
  
      const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: JSON.stringify(metadata)
      });
  
      if (!metadataResponse.ok) {
        throw new Error('Failed to upload metadata');
      }
  
      const metadataResult = await metadataResponse.json();
      setUploadedIPFSHash(metadataResult.IpfsHash);
      
      // 返回使用 Pinata 网关的完整 URL
      return `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`;
    } catch (err) {
      throw new Error('Failed to upload to IPFS: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const createCollection = async () => {
    if (!factoryContract) {
      setError('Please connect wallet first');
      return;
    }
  
    try {
      setLoading(true);
      setTransactionStatus('Creating collection...');
  
      if (!newCollection.name || !newCollection.symbol) {
        throw new Error('Name and symbol are required');
      }
  
      const maxSupply = parseInt(newCollection.maxSupply);
      if (isNaN(maxSupply) || maxSupply < 0) {
        throw new Error('Invalid max supply value');
      }
  
      const mintPrice = ethers.parseEther(newCollection.mintPrice.toString());
      
      // 创建集合时设置baseTokenURI为空，稍后在铸造时使用实际的IPFS hash
      const baseURI = '';
  
      const tx = await factoryContract.createCollection(
        newCollection.name,
        newCollection.symbol,
        maxSupply,
        baseURI,
        mintPrice
      );
  
      setTransactionStatus('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
  
      await fetchCollections();
      setSuccess('Collection created successfully!');
      setTransactionStatus('');
  
      setNewCollection({
        name: '',
        symbol: '',
        maxSupply: '0',
        mintPrice: '0.01'
      });
  
    } catch (err) {
      console.error('Creation error:', err);
      setError('Failed to create collection: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  //mintNFT 部分
  const mintNFT = async () => {
    if (!selectedCollection || !file) {
      setError(!selectedCollection ? 'Please select a collection first' : 'Please select a file to mint');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
  
      // 1. 上传图片到IPFS
      setTransactionStatus('Uploading image to IPFS...');
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      
      const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: imageFormData
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      const imageResult = await imageResponse.json();
      const imageUrl = `ipfs://${imageResult.IpfsHash}`;
      
      // 2. 创建和上传元数据
      setTransactionStatus('Creating metadata...');
      const metadata = {
        name: `NFT #${Date.now()}`,
        description: "A Collection NFT token",
        image: imageUrl,
        attributes: []
      };
  
      const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: JSON.stringify(metadata)
      });
  
      if (!metadataResponse.ok) {
        throw new Error('Failed to upload metadata');
      }
  
      const metadataResult = await metadataResponse.json();
      const metadataHash = metadataResult.IpfsHash;
      console.log('Metadata IPFS Hash:', metadataHash);
  
      // 3. 铸造NFT
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const collectionContract = new ethers.Contract(
        selectedCollection,
        collectionABI,
        signer
      );
  
      // 修改baseTokenURI为元数据的IPFS hash
      setTransactionStatus('Setting token URI...');
      const baseURISetter = new ethers.Contract(
        selectedCollection,
        ['function setBaseURI(string memory _baseURI) public'],
        signer
      );
      
      const setURITx = await baseURISetter.setBaseURI(metadataHash);
      await setURITx.wait();
  
      // 铸造NFT
      setTransactionStatus('Minting NFT...');
      const mintPrice = await collectionContract.mintPrice();
      const tx = await collectionContract.mint({
        value: mintPrice
      });
  
      await tx.wait();
      
      setSuccess('NFT minted successfully!');
      await fetchOwnedNFTs();
      
      setFile(null);
      setPreview('');
  
    } catch (err) {
      console.error('Mint error:', err);
      setError('Failed to mint NFT: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
      setTransactionStatus('');
    }
  };
  
  const fetchCollections = async () => {
    if (!factoryContract) return;

    try {
      const collectionAddresses = await factoryContract.getCollections();
      setCollections(collectionAddresses);
    } catch (err) {
      console.error('Fetch collections error:', err);
      setError('Failed to fetch collections: ' + (err.message || 'Unknown error'));
    }
  };


  
  // 修改 fetchOwnedNFTs 函数中的区块范围
  const fetchOwnedNFTs = async () => {
    if (!selectedCollection || !account) return;
  
    try {
      setLoading(true);
      console.log('Fetching NFTs for account:', account);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const collectionContract = new ethers.Contract(
        selectedCollection,
        collectionABI,
        signer
      );
  
      const totalSupply = await collectionContract.totalSupply();
      console.log('Total Supply:', totalSupply.toString());
  
      const nfts = [];
      
      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        try {
          const owner = await collectionContract.ownerOf(tokenId);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            console.log('Found owned NFT:', tokenId);
            
            // 获取 tokenURI
            const tokenURI = await collectionContract.tokenURI(tokenId);
            console.log('Raw Token URI:', tokenURI);
            
            // 获取元数据
            try {
              // 处理元数据 URL
              const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
              console.log('Fetching metadata from:', metadataUrl);
              
              const response = await fetch(metadataUrl);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const metadata = await response.json();
              
              nfts.push({
                tokenId,
                tokenURI: metadataUrl,
                metadata: metadata,
                name: metadata.name || `NFT #${tokenId}`,
                description: metadata.description || 'An NFT token',
                image: metadata.image
              });
            } catch (metadataError) {
              console.warn('Failed to fetch metadata:', metadataError);
              // 添加基本信息
              nfts.push({
                tokenId,
                tokenURI,
                name: `NFT #${tokenId}`,
                description: 'An NFT token'
              });
            }
          }
        } catch (tokenError) {
          console.warn('Error checking token:', tokenId, tokenError);
          continue;
        }
      }
      
      console.log('Final NFTs list:', nfts);
      setOwnedNFTs(nfts);
      setError('');
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch NFTs: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      await connectWallet();
      setIsInitializing(false);
    };

    init();

    // MetaMask事件监听器
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectWallet();
        } else {
          setAccount('');
          setFactoryContract(null);
        }
      });

      // 添加链切换事件监听
      window.ethereum.on('chainChanged', async (chainId) => {
        if (chainId !== POLYGON_ZKEVM_CONFIG.chainId) {
          setError('Please switch to Polygon zkEVM Cardona Testnet');
          setFactoryContract(null);
        } else {
          await connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (factoryContract) {
      fetchCollections();
    }
  }, [factoryContract]);

  useEffect(() => {
    if (selectedCollection && account) {
      fetchOwnedNFTs();
    }
  }, [selectedCollection, account]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Wallet Connection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">NFT Collection Interface</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Connected Account:</p>
          <p className="font-mono">{account || 'Not connected'}</p>
          {!account && !isInitializing && (
            <button
              onClick={connectWallet}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
        
        {/* Create Collection Form */}
        {account && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Create New Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    name: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Symbol</label>
                <input
                  type="text"
                  value={newCollection.symbol}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    symbol: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Supply (0 for unlimited)</label>
                <input
                  type="number"
                  value={newCollection.maxSupply}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    maxSupply: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mint Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCollection.mintPrice}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    mintPrice: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              
              <button
                onClick={createCollection}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create Collection
              </button>
            </div>
          </div>
        )}

        {/* Collection Selection */}
        {collections.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Select Collection</h3>
            <select
              value={selectedCollection || ''}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a collection</option>
              {collections.map((addr, index) => (
                <option key={addr} value={addr}>
                  Collection {index + 1} ({addr})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* NFT Minting Interface */}
        {selectedCollection && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Mint New NFT</h3>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreview(reader.result);
                    };
                    reader.readAsDataURL(selectedFile);
                  }
                }}
                accept="image/*"
                className="hidden"
                id="nft-file"
              />
              <label 
                htmlFor="nft-file" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <svg 
                  className="w-8 h-8 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L88m4-4v12"
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  {file ? file.name : 'Click to upload NFT image'}
                </span>
              </label>
              
              {preview && (
                <div className="mt-4">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-w-xs mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Mint Button */}
            <button 
              onClick={mintNFT}
              disabled={loading || uploading || !file}
              className={`w-full mt-4 px-4 py-2 rounded transition-colors ${
                loading || uploading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Minting...' : 
               uploading ? 'Uploading...' : 
               'Mint NFT'}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {transactionStatus && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">{transactionStatus}</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}
      </div>

      {/* NFTs Display */}
      {selectedCollection && account && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your NFTs in Selected Collection</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading NFTs...</p>
          ) : ownedNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedNFTs.map((nft) => (
                <NFTCard
                  key={nft.tokenId.toString()}
                  nft={nft}
                  contractAddress={selectedCollection}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No NFTs found in this collection</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTInterface;