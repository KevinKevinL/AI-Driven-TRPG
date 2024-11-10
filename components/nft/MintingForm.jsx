import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

const NFTMintingForm = ({ contract, onMint, loading }) => {
  const [file, setFile] = useState(null);
  const [seriesId, setSeriesId] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadToIPFS = async (file) => {
    setUploading(true);
    try {
      // 这里使用示例 IPFS 网关，实际使用时需替换为你的 IPFS 节点或服务
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData
      });
      
      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (err) {
      throw new Error('Failed to upload to IPFS');
    } finally {
      setUploading(false);
    }
  };

  const handleMint = async () => {
    try {
      setError('');
      if (!file) {
        throw new Error('Please select a file to mint');
      }

      // 1. 上传文件到 IPFS
      const ipfsUrl = await uploadToIPFS(file);
      
      // 2. 创建新的 NFT 系列
      const createSeriesTx = await contract.createNFTSeries(
        0, // 无限供应量
        ipfsUrl,
        0  // 使用默认价格
      );
      await createSeriesTx.wait();
      
      // 3. 获取创建的系列 ID 并铸造 NFT
      const seriesId = await contract.getLastSeriesId();
      await onMint(seriesId);
      
      // 清理表单
      setFile(null);
      setPreview('');
      setSeriesId('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* 文件上传区域 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="nft-file"
          />
          <label 
            htmlFor="nft-file" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
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

        {/* Mint 按钮 */}
        <Button 
          onClick={handleMint}
          disabled={loading || uploading || !file}
          className="w-full"
        >
          {loading ? 'Minting...' : 
           uploading ? 'Uploading...' : 
           'Mint NFT'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NFTMintingForm;