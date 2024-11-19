import React, { useState, useEffect } from 'react';

const NFTCard = ({ nft }) => {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (!nft.tokenURI) {
          throw new Error('No token URI provided');
        }

        let url = nft.tokenURI;
        
        // 处理 ipfs:// 格式的 URI
        if (url.startsWith('ipfs://')) {
          // 替换为 Pinata 网关URL
          url = url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }

        console.log('Fetching metadata from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // 处理图片 URL（如果图片也是 IPFS 格式）
        if (data.image && data.image.startsWith('ipfs://')) {
          data.image = data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }
        
        setMetadata(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setError(error.message);
      }
    };

    fetchMetadata();
  }, [nft.tokenURI]);

  if (error) {
    return (
      <div className="border rounded-lg p-4 shadow-lg">
        <p className="text-red-500">Error loading NFT: {error}</p>
        <p className="text-sm text-gray-500">Token ID: {nft.tokenId?.toString()}</p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="border rounded-lg p-4 shadow-lg">
        <p className="text-gray-500">Loading NFT metadata...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-lg">
      <h3 className="text-xl font-bold mb-2">{metadata.name}</h3>
      {metadata.image && (
        <div className="relative w-full h-48">
          <img 
            src={metadata.image}
            alt={metadata.name || 'NFT Image'}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error('Image load error');
              e.target.src = '/placeholder-image.png';
            }}
          />
        </div>
      )}
      <p className="text-gray-600 mt-2">{metadata.description}</p>
      <div className="mt-2">
        <p className="text-sm"><span className="font-semibold">Token ID:</span> {nft.tokenId?.toString()}</p>
      </div>
    </div>
  );
};

export default NFTCard;