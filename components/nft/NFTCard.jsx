import React from 'react';
import { ethers } from 'ethers';

const NFTCard = ({ 
  tokenId, 
  seriesId, 
  tokenURI, 
  creator, 
  currentSupply, 
  maxSupply,
  name,
  description,
  attributes = [],
  isMinter,
  isListed,
  price
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4">
        <img 
          src={tokenURI} 
          alt={name || `NFT #${tokenId}`}
          className="w-full h-48 object-cover rounded-lg mb-2"
          onError={(e) => {
            e.target.src = '/api/placeholder/200/200';
          }}
        />
        <div className="space-y-2">
          <div>
            <p className="font-semibold">{name}</p>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium">Token ID:</p>
              <p className="text-gray-600">{tokenId.toString()}</p>
            </div>
            <div>
              <p className="font-medium">Series:</p>
              <p className="text-gray-600">{seriesId.toString()}</p>
            </div>
            <div>
              <p className="font-medium">Supply:</p>
              <p className="text-gray-600">
                {currentSupply} / {maxSupply === '0' ? '∞' : maxSupply}
              </p>
            </div>
            <div>
              <p className="font-medium">Creator:</p>
              <p className="text-gray-600 truncate">
                {creator.slice(0, 6)}...{creator.slice(-4)}
              </p>
            </div>
          </div>

          {/* Market Status */}
          {isListed && price && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Listed for: {ethers.formatEther(price)} TFIL
              </p>
            </div>
          )}

          {/* Creator Badge */}
          {isMinter && (
            <div className="mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Creator
              </span>
            </div>
          )}

          {/* Attributes */}
          {attributes.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Attributes:</p>
              <div className="grid grid-cols-2 gap-1">
                {attributes.map((attr, index) => (
                  <div key={index} className="text-xs bg-gray-100 rounded p-1">
                    <span className="font-medium">{attr.trait_type}:</span>
                    <br />
                    <span className="text-gray-600">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2 mt-2 pt-2 border-t">
            <a 
              href={tokenURI} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View Image ↗
            </a>
            <a 
              href={`https://calibration.filfox.info/address/${creator}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              View Creator ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;