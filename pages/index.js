import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CONTRACT_ADDRESS } from '../constants/networkConfig';

// 动态导入 NFTInterface 组件以避免 SSR 问题
const NFTInterface = dynamic(
  () => import('../components/NFTInterface'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <NFTInterface 
          contractAddress={CONTRACT_ADDRESS}
          contractABI={require('../artifacts/contracts/SocialNFT.sol/SocialNFT.json').abi}
        />
      </main>
    </div>
  );
}