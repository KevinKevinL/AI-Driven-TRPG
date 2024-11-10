import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from './nft/NFTCard';

const NFTInterface = ({ contractAddress, contractABI }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
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

  const FILECOIN_TESTNET_CONFIG = {
    chainId: '0x4CB2F',
    chainName: 'Filecoin - Calibration testnet',
    nativeCurrency: {
      name: 'Filecoin',
      symbol: 'tFIL',
      decimals: 18
    },
    rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
    blockExplorerUrls: ['https://calibration.filfox.info']
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('Connecting to wallet...');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: FILECOIN_TESTNET_CONFIG.chainId }],
        }).catch(async (switchError) => {
          console.log('Switch chain error:', switchError);
          if (switchError.code === 4902) {
            console.log('Adding Filecoin network...');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [FILECOIN_TESTNET_CONFIG],
            });
          } else {
            throw switchError;
          }
        });

        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('Connected account:', accounts[0]);
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log('Creating contract instance...');
        const nftContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        // 验证合约实例
        console.log('Verifying contract instance...');
        const name = await nftContract.name();
        console.log('Contract name:', name);
        
        setContract(nftContract);
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
      console.log('Preparing file upload to Pinata...');
      
      // 1. 首先上传图片文件
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      
      console.log('Uploading image to Pinata...');
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
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;
      console.log('Image uploaded:', imageUrl);
  
      // 2. 创建并上传元数据
      const metadata = {
        name: `SocialNFT #${Date.now()}`,
        description: "A SocialNFT token",
        image: imageUrl,
        attributes: [
          {
            trait_type: "Upload Time",
            value: new Date().toISOString()
          }
        ]
      };
  
      console.log('Uploading metadata to Pinata...');
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
      console.log('Metadata uploaded:', metadataResult);
      setUploadedIPFSHash(metadataResult.IpfsHash);
      
      return `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`;
    } catch (err) {
      console.error('Upload error:', err);
      throw new Error('Failed to upload to IPFS: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const mintNFT = async () => {
    if (!contract) {
      setError('Please connect your wallet first');
      return;
    }

    if (!file) {
      setError('Please select a file to mint');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // 1. Upload file to IPFS
      setTransactionStatus('Uploading to IPFS...');
      const ipfsUrl = await uploadToIPFS(file);
      console.log('IPFS URL:', ipfsUrl);
      
      // 2. Create new NFT series and mint in one transaction
      setTransactionStatus('Creating NFT series and minting...');
      console.log('Creating NFT series...');
      
      // 获取铸造价格
      const mintPrice = await contract.mintPrice();
      console.log('Mint price:', ethers.formatEther(mintPrice), 'ETH');

      // 创建系列
      const createSeriesTx = await contract.createNFTSeries(
        0, // unlimited supply
        ipfsUrl,
        0  // use default price
      );
      
      console.log('Create series transaction:', createSeriesTx.hash);
      setTransactionStatus(`Creating series... Transaction: ${createSeriesTx.hash}`);
      
      const receipt = await createSeriesTx.wait();
      console.log('Series creation receipt:', receipt);

      // 从事件中获取seriesId
      const seriesCreatedEvent = receipt.logs.find(log => {
        try {
          return log.topics[0] === contract.interface.getEvent('NFTSeriesCreated').topicHash;
        } catch (err) {
          return false;
        }
      });

      if (!seriesCreatedEvent) {
        throw new Error('Failed to get series ID from event');
      }

      const parsedEvent = contract.interface.parseLog({
        topics: seriesCreatedEvent.topics,
        data: seriesCreatedEvent.data
      });
      
      const seriesId = parsedEvent.args[0];
      console.log('Series ID:', seriesId.toString());
      
      // 铸造NFT
      setTransactionStatus('Minting NFT...');
      console.log('Minting NFT...');
      const tx = await contract.mintSeriesNFT(seriesId, {
        value: mintPrice
      });
      
      console.log('Mint transaction:', tx.hash);
      setTransactionStatus(`Minting... Transaction: ${tx.hash}`);
      
      const mintReceipt = await tx.wait();
      console.log('Mint complete!', mintReceipt);
      
      setSuccess(`NFT minted successfully! IPFS Hash: ${uploadedIPFSHash}`);
      
      // 刷新NFT列表
      await fetchOwnedNFTs();
      
      // Clear form
      setFile(null);
      setPreview('');
      setTransactionStatus('');
    } catch (err) {
      console.error('Mint error:', err);
      setError('Failed to mint NFT: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedNFTs = async () => {
    if (!contract || !account) return;
  
    try {
      setLoading(true);
      console.log('Fetching NFTs for account:', account);
      
      // 获取当前区块号
      const provider = new ethers.BrowserProvider(window.ethereum);
      const currentBlock = await provider.getBlockNumber();
      
      // Filecoin 网络限制查询范围约为16小时，按照30秒一个区块计算
      // 16小时 = 16 * 60 * 60 秒 = 57600 秒
      // 57600 秒 / 30 秒 = 1920 个区块
      const blockRange = 1900; // 留一些余量
      const fromBlock = Math.max(0, currentBlock - blockRange);
      
      console.log('Querying events from block:', fromBlock, 'to:', currentBlock);
      
      // 分批次获取事件
      const batchSize = 500; // 每批次查询的区块数
      const batches = Math.ceil((currentBlock - fromBlock) / batchSize);
      let allEvents = [];
      
      for (let i = 0; i < batches; i++) {
        const batchFromBlock = fromBlock + (i * batchSize);
        const batchToBlock = Math.min(batchFromBlock + batchSize - 1, currentBlock);
        
        console.log(`Fetching batch ${i + 1}/${batches}, blocks ${batchFromBlock}-${batchToBlock}`);
        
        try {
          const mintFilter = contract.filters.NFTMinted();
          const events = await contract.queryFilter(mintFilter, batchFromBlock, batchToBlock);
          allEvents = allEvents.concat(events);
        } catch (batchError) {
          console.warn(`Failed to fetch batch ${i + 1}:`, batchError);
          continue;
        }
      }
      
      console.log('Found total events:', allEvents.length);
  
      const nfts = [];
      const processed = new Set(); // 用于去重
      
      // 遍历所有事件
      for (const event of allEvents) {
        try {
          const [tokenId, seriesId, minter] = [
            event.args[0],
            event.args[1],
            event.args[2]
          ];
          
          // 避免重复处理
          const tokenKey = tokenId.toString();
          if (processed.has(tokenKey)) continue;
          processed.add(tokenKey);
          
          console.log('Processing token:', tokenKey);
  
          try {
            // 检查当前 token 的所有者
            const currentOwner = await contract.ownerOf(tokenId);
            
            // 只处理属于当前账户的 NFT
            if (currentOwner.toLowerCase() === account.toLowerCase()) {
              console.log('Found owned NFT:', tokenKey);
  
              // 获取系列信息
              const seriesInfo = await contract.getSeriesInfo(seriesId);
              console.log('Series info for token', tokenKey, ':', seriesInfo);
  
              // 获取并解析元数据
              let metadata = null;
              try {
                const response = await fetch(seriesInfo[3]); // baseTokenURI from series info
                metadata = await response.json();
                console.log('Metadata for token', tokenKey, ':', metadata);
              } catch (metadataError) {
                console.warn('Failed to fetch metadata for token', tokenKey, ':', metadataError);
              }
  
              // 获取市场信息
              let isListed = false;
              let price = '0';
              try {
                isListed = await contract.isTokenListed(tokenId);
                if (isListed) {
                  price = await contract.tokenIdToPrice(tokenId);
                }
              } catch (marketError) {
                console.warn('Failed to fetch market info:', marketError);
              }
  
              nfts.push({
                tokenId,
                seriesId,
                tokenURI: metadata?.image || seriesInfo[3],
                name: metadata?.name || `NFT #${tokenKey}`,
                description: metadata?.description || 'A SocialNFT token',
                attributes: metadata?.attributes || [],
                creator: seriesInfo[0],
                maxSupply: seriesInfo[1].toString(),
                currentSupply: seriesInfo[2].toString(),
                isMinter: minter.toLowerCase() === account.toLowerCase(),
                isListed,
                price
              });
            }
          } catch (ownerError) {
            console.warn('Failed to check ownership for token', tokenKey, ':', ownerError);
            continue;
          }
        } catch (err) {
          console.warn('Error processing event:', err);
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

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await connectWallet();
        } else {
          setAccount('');
          setContract(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('disconnect', () => {
        setAccount('');
        setContract(null);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, [contractAddress, contractABI]);

  useEffect(() => {
    if (contract && account) {
      fetchOwnedNFTs();
    }
  }, [contract, account]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">NFT Minting Interface</h2>
        
        {/* Transaction Status */}
        {transactionStatus && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">{transactionStatus}</p>
          </div>
        )}
        
        {/* IPFS Hash Display */}
        {uploadedIPFSHash && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-mono break-all">
              IPFS Hash: {uploadedIPFSHash}
            </p>
          </div>
        )}

        {/* Wallet Connection */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">Connected Account:</p>
          <p className="font-mono">{account || 'Not connected'}</p>
          {!account && !isInitializing && (
            <button
              onClick={connectWallet}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {account && (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    console.log('Selected file:', selectedFile.name);
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
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
              className={`w-full px-4 py-2 rounded transition-colors ${
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

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}
      </div>

      {/* NFTs Display */}
      {account && (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
    
    {loading ? (
      <p className="text-gray-600">Loading NFTs...</p>
    ) : ownedNFTs.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ownedNFTs.map((nft) => (
          <NFTCard
            key={nft.tokenId.toString()}
            tokenId={nft.tokenId}
            seriesId={nft.seriesId}
            tokenURI={nft.tokenURI}
            creator={nft.creator}
            currentSupply={nft.currentSupply}
            maxSupply={nft.maxSupply}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No NFTs found</p>
    )}
  </div>
)}
    </div>
  );
};

export default NFTInterface;