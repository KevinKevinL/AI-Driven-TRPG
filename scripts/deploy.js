// 把 deploy.js 中的内容复制到这里
const { ethers } = require("hardhat");

async function main() {
  // 获取合约工厂
  const SocialNFT = await ethers.getContractFactory("SocialNFT");
  
  // 部署合约
  console.log("Deploying SocialNFT...");
  const socialNFT = await SocialNFT.deploy();
  
  // 等待部署完成
  await socialNFT.waitForDeployment();
  
  const address = await socialNFT.getAddress();
  console.log("SocialNFT deployed to:", address);
}

// 运行部署脚本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });