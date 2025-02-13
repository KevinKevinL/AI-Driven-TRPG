const hre = require("hardhat");

async function main() {
  const COCCharacterNFT = await hre.ethers.getContractFactory("COCCharacterNFT");
  const cocNFT = await COCCharacterNFT.deploy();

  await cocNFT.waitForDeployment();
  
  const address = await cocNFT.getAddress();
  console.log("COCCharacterNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});