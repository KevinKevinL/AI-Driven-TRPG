const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SocialNFT", function () {
    let socialNFT;
    let owner;
    let creator;
    let buyer;
    let addrs;

    beforeEach(async function () {
        // 获取合约工厂
        const SocialNFT = await ethers.getContractFactory("SocialNFT");
        [owner, creator, buyer, ...addrs] = await ethers.getSigners();

        // 部署合约的新方式
        socialNFT = await SocialNFT.deploy();
        // 等待交易被确认
        await socialNFT.waitForDeployment();
    });

    describe("NFT系列创建和铸造", function () {
        it("应该能成功创建NFT系列", async function () {
            const maxSupply = 100;
            const baseURI = "ipfs://QmTest/";
            const price = ethers.parseEther("0.0001");

            await socialNFT.connect(creator).createNFTSeries(
                maxSupply,
                baseURI,
                price
            );

            const seriesInfo = await socialNFT.getSeriesInfo(1);
            expect(seriesInfo.creator).to.equal(creator.address);
            expect(seriesInfo.maxSupply).to.equal(maxSupply);
            expect(seriesInfo.currentSupply).to.equal(0);
            expect(seriesInfo.baseTokenURI).to.equal(baseURI);
            expect(seriesInfo.price).to.equal(price);
            expect(seriesInfo.isActive).to.equal(true);
        });

        it("应该能成功铸造NFT", async function () {
            await socialNFT.connect(creator).createNFTSeries(
                100,
                "ipfs://QmTest/",
                ethers.parseEther("0.0001")
            );

            await socialNFT.connect(buyer).mintSeriesNFT(
                1,
                { value: ethers.parseEther("0.0001") }
            );

            expect(await socialNFT.ownerOf(1)).to.equal(buyer.address);
            const seriesInfo = await socialNFT.getSeriesInfo(1);
            expect(seriesInfo.currentSupply).to.equal(1);
        });

        it("应该遵守每日铸造限制", async function () {
            await socialNFT.connect(creator).createNFTSeries(
                100,
                "ipfs://QmTest/",
                ethers.parseEther("0.0001")
            );

            for(let i = 0; i < 10; i++) {
                await socialNFT.connect(buyer).mintSeriesNFT(
                    1,
                    { value: ethers.parseEther("0.0001") }
                );
            }

            await expect(
                socialNFT.connect(buyer).mintSeriesNFT(
                    1,
                    { value: ethers.parseEther("0.0001") }
                )
            ).to.be.revertedWith("Daily mint limit reached");
        });
    });

    describe("NFT交易", function () {
        beforeEach(async function () {
            await socialNFT.connect(creator).createNFTSeries(
                100,
                "ipfs://QmTest/",
                ethers.parseEther("0.0001")
            );

            await socialNFT.connect(buyer).mintSeriesNFT(
                1,
                { value: ethers.parseEther("0.0001") }
            );
        });

        it("应该能成功上架NFT", async function () {
            const listPrice = ethers.parseEther("0.1");
            await socialNFT.connect(buyer).listNFT(1, listPrice);

            expect(await socialNFT.isTokenListed(1)).to.equal(true);
            expect(await socialNFT.tokenIdToPrice(1)).to.equal(listPrice);
        });

        it("应该能成功购买NFT", async function () {
            const listPrice = ethers.parseEther("0.1");
            await socialNFT.connect(buyer).listNFT(1, listPrice);

            await socialNFT.connect(addrs[0]).buyNFT(
                1,
                { value: listPrice }
            );

            expect(await socialNFT.ownerOf(1)).to.equal(addrs[0].address);
            expect(await socialNFT.isTokenListed(1)).to.equal(false);
        });
    });

    describe("收益分配", function () {
        it("应该正确分配铸造收益", async function () {
            const mintPrice = ethers.parseEther("0.0001");
            
            await socialNFT.connect(creator).createNFTSeries(
                100,
                "ipfs://QmTest/",
                mintPrice
            );

            const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);
            
            const mintTx = await socialNFT.connect(buyer).mintSeriesNFT(
                1,
                { value: mintPrice }
            );
            await mintTx.wait();

            const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);
            
            const actualEarning = creatorBalanceAfter - creatorBalanceBefore;
            const expectedEarning = mintPrice * 700n / 1000n;

            expect(actualEarning).to.equal(expectedEarning);
        });
    });
});