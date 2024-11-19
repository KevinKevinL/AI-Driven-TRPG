import React, { useState, useEffect } from 'react';

const StatDisplay = ({ label, value, color = "text-blue-600" }) => (
  <div className="flex items-center space-x-1">
    <span className="text-gray-700 font-medium">{label}</span>
    <span className={`${color} font-bold`}>{value}</span>
  </div>
);

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
        
        if (url.startsWith('ipfs://')) {
          url = url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }
        if (url.includes('gateway.pinata.cloud/ipfs/')) {
          const ipfsHash = url.split('ipfs/').pop();
          url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        }

        console.log('Fetching metadata from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.image) {
          if (data.image.startsWith('ipfs://')) {
            data.image = data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          }
          if (data.image.includes('gateway.pinata.cloud/ipfs/')) {
            const ipfsHash = data.image.split('ipfs/').pop();
            data.image = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          }
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
      <div className="border rounded-lg p-4 shadow-lg bg-white w-full">
        <p className="text-red-500">Error loading character card: {error}</p>
        <p className="text-sm text-gray-500">Token ID: {nft.tokenId?.toString()}</p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="border rounded-lg p-4 shadow-lg bg-white w-full">
        <p className="text-gray-500">Loading character card...</p>
      </div>
    );
  }

  const { characteristics, derived } = metadata.attributes;

  return (
    <div className="border rounded-lg p-6 shadow-lg bg-white w-full min-w-[300px]">
      {/* 角色卡片头部 */}
      <div className="mb-4 border-b pb-4">
        <h3 className="text-2xl font-bold mb-2">{metadata.name}</h3>
        <div className="flex flex-wrap justify-between text-sm gap-2">
          <span className="text-gray-600">{metadata.attributes.occupation}</span>
          <div className="space-x-4">
            <span className="text-gray-600">Age: {metadata.attributes.age}</span>
            <span className="text-gray-600">Player: {metadata.attributes.player}</span>
          </div>
        </div>
      </div>

      {/* 角色图片 */}
      {metadata.image && (
        <div className="relative w-full h-60 mb-6">
          <img
            src={metadata.image}
            alt={metadata.name || 'Character Image'}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error('Image load error');
              e.target.src = '/placeholder-image.png';
            }}
          />
        </div>
      )}

      {/* 角色描述 */}
      <p className="text-gray-700 mb-6 text-sm">{metadata.description}</p>

      {/* 属性区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 基础属性 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-bold text-sm mb-3 text-gray-700 border-b pb-2">Characteristics</h4>
          <div className="grid grid-cols-1 gap-y-3">
            {characteristics && Object.entries(characteristics).map(([key, value]) => (
              <StatDisplay 
                key={key}
                label={key.toUpperCase()}
                value={value}
              />
            ))}
          </div>
        </div>

        {/* 衍生属性 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-bold text-sm mb-3 text-gray-700 border-b pb-2">Derived Stats</h4>
          <div className="grid grid-cols-1 gap-y-3">
            {derived && Object.entries(derived).map(([key, value]) => (
              <StatDisplay 
                key={key}
                label={key.toUpperCase()}
                value={value}
                color={key === 'hp' ? 'text-red-600' : 
                       key === 'mp' ? 'text-blue-600' : 
                       key === 'sanity' ? 'text-purple-600' : 'text-gray-600'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Token ID */}
      <div className="mt-6 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">Token ID: {nft.tokenId?.toString()}</p>
      </div>
    </div>
  );
};

export default NFTCard;