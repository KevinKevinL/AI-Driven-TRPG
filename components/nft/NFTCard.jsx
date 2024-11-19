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
        
        // 检查URL格式并规范化
        if (url.startsWith('ipfs://')) {
          url = url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }
        // 如果URL已经是https格式但包含多个gateway引用，进行清理
        if (url.includes('gateway.pinata.cloud/ipfs/')) {
          const ipfsHash = url.split('ipfs/').pop(); // 获取IPFS hash
          url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        }

        console.log('Fetching metadata from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // 处理图片URL
        if (data.image) {
          if (data.image.startsWith('ipfs://')) {
            data.image = data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          }
          // 清理可能重复的gateway引用
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
      <div className="border rounded-lg p-4 shadow-lg bg-white">
        <p className="text-red-500">Error loading character card: {error}</p>
        <p className="text-sm text-gray-500">Token ID: {nft.tokenId?.toString()}</p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="border rounded-lg p-4 shadow-lg bg-white">
        <p className="text-gray-500">Loading character card...</p>
      </div>
    );
  }

  // 辅助函数：格式化属性值显示
  const formatAttributeValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white">
      {/* 角色基本信息 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{metadata.name}</h3>
          <p className="text-sm text-gray-600">{metadata.attributes.occupation}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Age: {metadata.attributes.age}</p>
          <p className="text-sm text-gray-600">Player: {metadata.attributes.player}</p>
        </div>
      </div>

      {/* 角色图片 */}
      {metadata.image && (
        <div className="relative w-full h-48 mb-4">
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
      <p className="text-gray-700 mb-4">{metadata.description}</p>

      {/* 属性值 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 基础属性 */}
        <div className="border rounded p-3">
          <h4 className="font-semibold mb-2">Characteristics</h4>
          <div className="grid grid-cols-2 gap-2">
            {metadata.attributes.characteristics && Object.entries(metadata.attributes.characteristics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-600">{key.toUpperCase()}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 衍生属性 */}
        <div className="border rounded p-3">
          <h4 className="font-semibold mb-2">Derived Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            {metadata.attributes.derived && Object.entries(metadata.attributes.derived).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-600">{key.toUpperCase()}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 状态和技能 */}
      {metadata.attributes.status && (
        <div className="border rounded p-3 mb-4">
          <h4 className="font-semibold mb-2">Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(metadata.attributes.status).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAttributeValue(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token信息 */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Token ID: {nft.tokenId?.toString()}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;