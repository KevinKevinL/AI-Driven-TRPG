import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CONTRACT_ADDRESS } from '@/constants/networkConfig';

// 导入两个合约的 ABI
import factoryArtifact from '@/artifacts/contracts/NFTCollectionFactory.sol/NFTCollectionFactory.json';
import collectionArtifact from '@/artifacts/contracts/NFTCollectionFactory.sol/NFTCollection.json';

const NFTInterface = dynamic(
  () => import('@/components/NFTInterface'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8">
        <NFTInterface
          factoryAddress={CONTRACT_ADDRESS}
          factoryABI={factoryArtifact.abi}
          collectionABI={collectionArtifact.abi}
        />
      </main>
    </div>
  );
}