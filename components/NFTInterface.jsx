import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './nft/NFTCard';
import DatabaseManager from '@components/coc/DatabaseManager';

const POLYGON_ZKEVM_CONFIG = {
  chainId: '0x98a',
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

  const [characterId, setCharacterId] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const {
    loadCharacterAllInfo
  } = DatabaseManager();
  // Collection creation state
  const [newCollection, setNewCollection] = useState({
    name: '',
    symbol: '',
    maxSupply: '0',
    mintPrice: '0.01'
  });


  const loadCharacterData = async () => {
    if (!characterId.trim()) {
      setError('Please enter a character ID');
      return false;
    }

    try {
      setLoading(true);
      setError('');
      const data = await loadCharacterAllInfo(characterId);
      
      if (!data || !data.characterInfo) {
        throw new Error('Character not found');
      }

      // 转换数据库数据为NFT元数据格式
      const formattedData = {
        name: data.characterInfo.name,
        gender:data.characterInfo.gender,
        residence:data.characterInfo.residence,
        birthplace:data.characterInfo.birthplace,
        professionId:data.characterInfo.profession_id,
        description: data.characterInfo.description,
        ifNpc:data.characterInfo.if_npc,
        attributes: {
          characteristics: {
            str: data.attributes.strength,
            con: data.attributes.constitution,
            siz: data.attributes.size,
            dex: data.attributes.dexterity,
            app: data.attributes.appearance,
            int: data.attributes.intelligence,
            pow: data.attributes.power,
            edu: data.attributes.education,
            luck:data.attributes.luck,
            credit:data.attributes.credit_rating
          },
          derived: {
            hp: data.derivedAttributes.hitPoints,
            mp: data.derivedAttributes.magicPoints,
            sanity: data.derivedAttributes.sanity,
            interestPoints: data.derivedAttributes.interestPoints,
            moveRate: data.derivedAttributes.moveRate,
            damageBonus:data.derivedAttributes.damageBonus,
            build: data.derivedAttributes.build,
            professionalPoints: data.derivedAttributes.professionalPoints
          }
        },
        skills:{
          Fighting: data.skills.Fighting,
          Firearms: data.skills.Firearms,
          Dodge: data.skills.Dodge,
          Mechanics: data.skills.Mechanics,
          Drive: data.skills.Drive,
          Stealth: data.skills.Stealth,
          Investigate: data.skills.Investigate,
          Sleight_of_Hand: data.skills.Sleight_of_Hand,
          Electronics: data.skills.Electronics,
          History: data.skills.History,
          Science: data.skills.Science,
          Medicine: data.skills.Medicine,
          Occult: data.skills.Occult,
          Library_Use: data.skills.Library_Use,
          Art: data.skills.Art,
          Persuade: data.skills.Persuade,
          Psychology: data.skills.Psychology
        }
      };

      setCharacterData(formattedData);
      return true;
    } catch (err) {
      setError('Failed to load character data: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const switchToPolygonZkEVM = async () => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_ZKEVM_CONFIG.chainId }],
      });
      return true;
    } catch (switchError) {
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
        const networkSwitched = await switchToPolygonZkEVM();
        if (!networkSwitched) {
          throw new Error('Please switch to Polygon zkEVM Cardona Testnet');
        }

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
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

  const validateCharacterData = (data) => {
    if (!data.name || !data.description) {
      throw new Error('Name and description are required');
    }
    
    const characteristics = data.attributes.characteristics;
    for (const [key, value] of Object.entries(characteristics)) {
      if (value < 1 || value > 99) {
        throw new Error(`${key.toUpperCase()} must be between 1 and 99`);
      }
    }

    return true;
  };

  const uploadToIPFS = async (file) => {
    setUploading(true);
    setTransactionStatus('Uploading to IPFS...');
    try {
      if (!characterData) {
        throw new Error('Please load character data first');
      }

      // Upload image
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
      const imageUrl = `ipfs://${imageData.IpfsHash}`;
      
      // Create complete metadata object using loaded character data
      const metadata = {
        name: characterData.name,
        description: characterData.description,
        image: imageUrl,
        gender: characterData.gender,
        residence: characterData.residence,
        birthplace: characterData.birthplace,
        professionId: characterData.professionId,
        ifNpc: characterData.ifNpc,
        attributes: {
          characteristics: characterData.attributes.characteristics,
          derived: characterData.attributes.derived
        },
        skills: characterData.skills
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
      
      return metadataResult.IpfsHash;
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
  
  const mintNFT = async () => {
    if (!selectedCollection || !file) {
      setError(!selectedCollection ? 'Please select a collection first' : 'Please select a file to mint');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
  
      const metadataHash = await uploadToIPFS(file);
      console.log('Metadata IPFS Hash:', metadataHash);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const collectionContract = new ethers.Contract(
        selectedCollection,
        collectionABI,
        signer
      );
  
      setTransactionStatus('Setting token URI...');
      const baseURISetter = new ethers.Contract(
        selectedCollection,
        ['function setBaseURI(string memory _baseURI) public'],
        signer
      );
      
      const setURITx = await baseURISetter.setBaseURI(`https://gateway.pinata.cloud/ipfs/${metadataHash}`);
      await setURITx.wait();
  
      setTransactionStatus('Minting NFT...');
      const mintPrice = await collectionContract.mintPrice();
      const tx = await collectionContract.mint({
        value: mintPrice
      });
  
      await tx.wait();
      
      setSuccess('Character Card NFT minted successfully!');
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

  const fetchOwnedNFTs = async () => {
    if (!selectedCollection || !account) return;
  
    try {
      setLoading(true);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const collectionContract = new ethers.Contract(
        selectedCollection,
        collectionABI,
        signer
      );
  
      const totalSupply = await collectionContract.totalSupply();
      const nfts = [];
      
      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        try {
          const owner = await collectionContract.ownerOf(tokenId);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            const tokenURI = await collectionContract.tokenURI(tokenId);
            
            try {
              const metadataUrl = tokenURI.startsWith('ipfs://') 
                ? tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                : tokenURI;
              
              const response = await fetch(metadataUrl);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const metadata = await response.json();
              
              nfts.push({
                tokenId,
                tokenURI: metadataUrl,
                metadata: metadata,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                attributes: metadata.attributes
              });
            } catch (metadataError) {
              console.warn('Failed to fetch metadata:', metadataError);
              nfts.push({
                tokenId,
                tokenURI,
                name: `NFT #${tokenId}`,
                description: 'Character Card'
              });
            }
          }
        } catch (tokenError) {
          console.warn('Error checking token:', tokenId, tokenError);
          continue;
        }
      }
      
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
    <div className="min-h-screen w-full fixed inset-0 bg-[#0a0d11] bg-gradient-radial-emerald overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-500 font-lovecraft tracking-wider drop-shadow-lg">
            Character Card NFT
            <span className="block text-2xl mt-2 text-emerald-400/80">
              Interface
            </span>
          </h1>
        </div>

        {/* Wallet Connection */}
        <div className="bg-[#0a0d11]/80 backdrop-blur-sm rounded-lg shadow-lg shadow-emerald-900/20 
                      border border-emerald-900/30 p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-emerald-400/80">Connected Account:</p>
            <p className="font-mono text-emerald-400">{account || 'Not connected'}</p>
            {!account && !isInitializing && (
              <button
                onClick={connectWallet}
                className="mt-2 px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-lg 
                         hover:bg-emerald-800/50 transition-colors border border-emerald-900/30
                         shadow-lg shadow-emerald-900/30 font-lovecraft tracking-wide"
              >
                Connect Wallet
              </button>
            )}
          </div>
          
{/* Create Collection Form */}
{account && (
          <div className="mt-6 border-t border-emerald-900/30 pt-6">
            <h3 className="text-xl font-bold mb-4 text-emerald-500 font-lovecraft tracking-wider">Create New Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-400">Name</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    name: e.target.value
                  })}
                  className="mt-1 block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                           shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Collection Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-400">Symbol</label>
                <input
                  type="text"
                  value={newCollection.symbol}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    symbol: e.target.value
                  })}
                  className="mt-1 block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                           shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="COC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-400">Max Supply (0 for unlimited)</label>
                <input
                  type="number"
                  value={newCollection.maxSupply}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    maxSupply: e.target.value
                  })}
                  className="mt-1 block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                           shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-400">Mint Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCollection.mintPrice}
                  onChange={(e) => setNewCollection({
                    ...newCollection,
                    mintPrice: e.target.value
                  })}
                  className="mt-1 block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                           shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  min="0"
                />
              </div>
              
              <button
                onClick={createCollection}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg font-lovecraft tracking-wide
                         bg-emerald-900/50 text-emerald-400 border border-emerald-900/30
                         hover:bg-emerald-800/50 transition-colors shadow-lg shadow-emerald-900/30
                         disabled:bg-gray-800/50 disabled:text-emerald-400/50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
            </div>
          </div>
        )}

          {/* Collection Selection */}
          {collections.length > 0 && (
            <div className="mt-6 border-t border-emerald-900/30 pt-6">
              <h3 className="text-xl font-bold mb-4 text-emerald-500 font-lovecraft tracking-wider">Select Collection</h3>
              <select
                value={selectedCollection || ''}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                         shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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

          {/* Character Card Creation */}
          {selectedCollection && (
            <div className="mt-6 border-t border-emerald-900/30 pt-6">
              <h3 className="text-xl font-bold mb-4 text-emerald-500 font-lovecraft tracking-wider">Create Character Card NFT</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-400">Character ID</label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      value={characterId}
                      onChange={(e) => setCharacterId(e.target.value)}
                      className="block w-full rounded-lg border-emerald-900/30 bg-[#0a0d11] text-emerald-400
                               shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter character ID"
                    />
                    <button
                      onClick={loadCharacterData}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-lg 
                               hover:bg-emerald-800/50 transition-colors border border-emerald-900/30
                               shadow-lg shadow-emerald-900/30 font-lovecraft tracking-wide
                               disabled:bg-gray-800/50 disabled:text-emerald-400/50
                               disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load Data'}
                    </button>
                  </div>
                </div>

                {/* Character Data Preview */}
                {characterData && (
                  <div className="mt-4 p-4 bg-emerald-900/10 rounded-lg border border-emerald-900/30">
                    <h4 className="font-medium text-lg mb-2 text-emerald-500 font-lovecraft">Character Data Preview</h4>
                    <div className="space-y-2 text-emerald-400">
                      <p><span className="font-medium text-emerald-300">Name:</span> {characterData.name}</p>
                      <p><span className="font-medium text-emerald-300">Description:</span> {characterData.description}</p>
                      <p><span className="font-medium text-emerald-300">Gender:</span> {characterData.gender}</p>
                      <p><span className="font-medium text-emerald-300">Residence:</span> {characterData.residence}</p>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                {characterData && (
                  <div className="border-2 border-dashed border-emerald-900/30 rounded-lg p-6 text-center
                                bg-emerald-900/10 hover:bg-emerald-900/20 transition-colors">
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
                        className="w-8 h-8 text-emerald-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-sm text-emerald-400">
                        {file ? file.name : 'Upload character image'}
                      </span>
                    </label>
                    
                    {preview && (
                      <div className="mt-4">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-w-xs mx-auto rounded-lg border border-emerald-900/30"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Mint Button */}
                {characterData && (
                  <button 
                    onClick={mintNFT}
                    disabled={loading || uploading || !file}
                    className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors font-lovecraft tracking-wide
                              ${loading || uploading || !file
                                ? 'bg-gray-800/50 text-emerald-400/50 cursor-not-allowed'
                                : 'bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50 border border-emerald-900/30'
                              } shadow-lg shadow-emerald-900/30`}
                  >
                    {loading ? 'Minting...' : 
                     uploading ? 'Uploading...' : 
                     'Mint Character Card NFT'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {transactionStatus && (
            <div className="mt-4 p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
              <p className="text-emerald-400">{transactionStatus}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/10 border border-red-900/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-4 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
              <p className="text-emerald-400">{success}</p>
            </div>
          )}
        </div>

        {/* NFTs Display */}
        {selectedCollection && account && (
          <div className="bg-[#0a0d11]/80 backdrop-blur-sm rounded-lg shadow-lg shadow-emerald-900/20 
                         border border-emerald-900/30 p-6">
            <h2 className="text-2xl font-bold mb-4 text-emerald-500 font-lovecraft tracking-wider">Your Character Cards</h2>
            
            {loading ? (
              <p className="text-emerald-400/60">Loading Character Cards...</p>
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
              <p className="text-emerald-400/60">No Character Cards found in this collection</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTInterface;