import React, { useState, useEffect } from 'react';

// Modal Component
const CharacterModal = ({ isOpen, onClose, metadata }) => {
  if (!isOpen || !metadata) return null;

  const { characteristics, derived } = metadata.attributes;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="max-w-4xl w-full bg-[#0a0d11] border border-emerald-900/30 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-emerald-900/30 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-emerald-500 font-lovecraft tracking-wider">{metadata.name}</h2>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-emerald-400"><span className="text-emerald-300">Gender:</span> {metadata.gender}</p>
              <p className="text-emerald-400"><span className="text-emerald-300">Residence:</span> {metadata.residence}</p>
            </div>
            <div>
              <p className="text-emerald-400"><span className="text-emerald-300">Birthplace:</span> {metadata.birthplace}</p>
              <p className="text-emerald-400"><span className="text-emerald-300">Type:</span> {metadata.ifNpc ? 'NPC' : 'PC'}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-2 font-lovecraft">Description</h3>
          <p className="text-emerald-300/80 leading-relaxed">{metadata.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Characteristics */}
          <div className="bg-emerald-900/10 rounded-lg p-4 border border-emerald-900/30">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 font-lovecraft">Characteristics</h3>
            <div className="grid grid-cols-2 gap-2">
              {characteristics && Object.entries(characteristics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-emerald-300">{key.toUpperCase()}</span>
                  <span className="text-emerald-400">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derived Stats */}
          <div className="bg-emerald-900/10 rounded-lg p-4 border border-emerald-900/30">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 font-lovecraft">Derived Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              {derived && Object.entries(derived).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-emerald-300">{key.toUpperCase()}</span>
                  <span className={key === 'hp' ? 'text-red-400' : 
                                 key === 'mp' ? 'text-blue-400' : 
                                 key === 'sanity' ? 'text-purple-400' : 'text-emerald-400'}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        {metadata.skills && (
          <div className="mt-6 bg-emerald-900/10 rounded-lg p-4 border border-emerald-900/30">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 font-lovecraft">Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(metadata.skills).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-emerald-300">{key.replace('_', ' ')}</span>
                  <span className="text-emerald-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-lg 
                   hover:bg-emerald-800/50 transition-colors border border-emerald-900/30
                   font-lovecraft tracking-wide"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Card Component
const NFTCard = ({ nft }) => {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="border border-red-900/30 rounded-lg p-4 shadow-lg bg-[#0a0d11] w-full">
        <p className="text-red-400">Error loading character card: {error}</p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="border border-emerald-900/30 rounded-lg p-4 shadow-lg bg-[#0a0d11] w-full">
        <p className="text-emerald-400/60">Loading character card...</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="border border-emerald-900/30 rounded-lg overflow-hidden bg-[#0a0d11] shadow-lg
                   hover:border-emerald-600/50 transition-all cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Preview Card Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-emerald-500 font-lovecraft tracking-wider mb-2">
            {metadata.name}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 text-sm mb-4">
            <p className="text-emerald-400">
              <span className="text-emerald-300">Gender:</span> {metadata.gender}
            </p>
            <p className="text-emerald-400">
              <span className="text-emerald-300">Birthplace:</span> {metadata.birthplace}
            </p>
            <p className="text-emerald-400">
              <span className="text-emerald-300">Residence:</span> {metadata.residence}
            </p>
            <p className="text-emerald-400">
              <span className="text-emerald-300">Type:</span> {metadata.ifNpc ? 'NPC' : 'PC'}
            </p>
          </div>
        </div>

        {/* Character Image */}
        {metadata.image && (
          <div className="w-full h-48 relative">
            <img
              src={metadata.image}
              alt={metadata.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error');
                e.target.src = '/placeholder-image.png';
              }}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <CharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metadata={metadata}
      />
    </>
  );
};

export default NFTCard;