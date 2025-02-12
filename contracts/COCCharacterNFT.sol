// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Character data structures
struct Attributes {
    uint8 strength;
    uint8 constitution;
    uint8 size;
    uint8 dexterity;
    uint8 appearance;
    uint8 intelligence;
    uint8 power;
    uint8 education;
    uint8 luck;
    uint8 creditRating;
}

struct DerivedAttributes {
    uint8 sanity;
    uint8 magicPoints;
    uint8 hitPoints;
    uint8 moveRate;
    int8 damageBonus;
    int8 build;
}

struct Skills {
    uint8 fighting;
    uint8 firearms;
    uint8 dodge;
    uint8 mechanics;
    uint8 drive;
    uint8 stealth;
    uint8 investigate;
    uint8 sleightOfHand;
    uint8 electronics;
    uint8 history;
    uint8 science;
    uint8 medicine;
    uint8 occult;
    uint8 libraryUse;
    uint8 art;
    uint8 persuade;
    uint8 psychology;
}

struct Character {
    string name;
    string gender;
    string residence;
    string birthplace;
    uint8 professionId;
    string description;
    Attributes attributes;
    DerivedAttributes derivedAttributes;
    Skills skills;
}

contract COCCharacterNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    // 计数器
    uint256 private _tokenIds;
    uint256 private _seriesIds;
    
    // NFT铸造价格
    uint256 public mintPrice = 0.0001 ether;
    
    // 每日铸造限制
    uint256 public dailyMintLimit = 10;
    
    // NFT系列结构
    struct NFTSeries {
        address creator;      // 创作者
        uint256 maxSupply;   // 最大供应量，0表示无限量
        uint256 currentSupply; // 当前供应量
        string baseTokenURI;  // 基础URI
        uint256 price;       // 铸造价格，0表示使用默认价格
        bool isActive;       // 是否激活
    }
    
    // 映射关系
    mapping(uint256 => NFTSeries) public nftSeries;          // seriesId => Series
    mapping(uint256 => Character) public characters;         // tokenId => Character
    mapping(address => uint256) public dailyMints;          // 用户每日铸造数量
    mapping(address => uint256) public lastMintDay;         // 用户最后铸造时间
    mapping(uint256 => uint256) public tokenIdToPrice;      // NFT市场 - 价格
    mapping(uint256 => bool) public isTokenListed;          // NFT市场 - 是否在售
    mapping(uint256 => uint256) public tokenIdToSeries;     // tokenId => seriesId
    
    // 平台费率
    uint256 public platformFee = 25; // 2.5%
    
    // 事件
    event NFTSeriesCreated(uint256 indexed seriesId, address creator, uint256 maxSupply, string baseTokenURI);
    event CharacterCreated(uint256 indexed tokenId, uint256 indexed seriesId, address creator, string name, uint8 professionId);
    event NFTListed(uint256 indexed tokenId, uint256 price, address seller);
    event NFTSold(uint256 indexed tokenId, uint256 price, address seller, address buyer);
    event NFTUnlisted(uint256 indexed tokenId);
    
    constructor() ERC721("COC Character NFT", "COCNFT") Ownable(msg.sender) ReentrancyGuard() {}
    
    // 创建NFT系列
    function createNFTSeries(
        uint256 maxSupply,
        string memory baseTokenURI,
        uint256 price
    ) public returns (uint256) {
        _seriesIds++;
        uint256 newSeriesId = _seriesIds;
        
        nftSeries[newSeriesId] = NFTSeries({
            creator: msg.sender,
            maxSupply: maxSupply,
            currentSupply: 0,
            baseTokenURI: baseTokenURI,
            price: price,
            isActive: true
        });
        
        emit NFTSeriesCreated(newSeriesId, msg.sender, maxSupply, baseTokenURI);
        return newSeriesId;
    }
    
    // 检查并重置每日铸造限制
    modifier checkDailyLimit() {
        uint256 currentDay = block.timestamp / 86400;
        if (currentDay > lastMintDay[msg.sender]) {
            dailyMints[msg.sender] = 0;
            lastMintDay[msg.sender] = currentDay;
        }
        require(dailyMints[msg.sender] < dailyMintLimit, "Daily mint limit reached");
        _;
    }
    
    // 铸造克苏鲁角色NFT
    struct CharacterInput {
        uint256 seriesId;
        string name;
        string gender;
        string residence;
        string birthplace;
        uint8 professionId;
        string description;
        Attributes attributes;
        DerivedAttributes derivedAttributes;
        Skills skills;
    }
    
    function createCharacter(CharacterInput memory input) public payable checkDailyLimit returns (uint256) {
        NFTSeries storage series = nftSeries[input.seriesId];
        require(series.isActive, "Series is not active");
        
        if(series.maxSupply > 0) {
            require(series.currentSupply < series.maxSupply, "Series supply limit reached");
        }
        
        uint256 mintCost = series.price > 0 ? series.price : mintPrice;
        require(msg.value >= mintCost, "Insufficient payment");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        // 存储角色数据
        characters[newTokenId] = Character({
            name: input.name,
            gender: input.gender,
            residence: input.residence,
            birthplace: input.birthplace,
            professionId: input.professionId,
            description: input.description,
            attributes: input.attributes,
            derivedAttributes: input.derivedAttributes,
            skills: input.skills
        });
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, string(abi.encodePacked(series.baseTokenURI, newTokenId.toString())));
        
        series.currentSupply++;
        tokenIdToSeries[newTokenId] = input.seriesId;
        dailyMints[msg.sender]++;
        
        // 分配铸造费用
        if(series.creator != owner()) {
            uint256 creatorFee = (msg.value * 700) / 1000; // 70%给创作者
            payable(series.creator).transfer(creatorFee);
        }
        
        emit CharacterCreated(newTokenId, input.seriesId, msg.sender, input.name, input.professionId);
        return newTokenId;
    }
    
    // 查询角色数据
    function getCharacter(uint256 tokenId) public view returns (Character memory) {
        require(ownerOf(tokenId) != address(0), "Character does not exist");
        return characters[tokenId];
    }
    
    // 查询系列信息
    function getSeriesInfo(uint256 seriesId) public view returns (
        address creator,
        uint256 maxSupply,
        uint256 currentSupply,
        string memory baseTokenURI,
        uint256 price,
        bool isActive
    ) {
        NFTSeries memory series = nftSeries[seriesId];
        return (
            series.creator,
            series.maxSupply,
            series.currentSupply,
            series.baseTokenURI,
            series.price,
            series.isActive
        );
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
    
    // 修改系列状态
    function toggleSeriesActive(uint256 seriesId) public {
        require(nftSeries[seriesId].creator == msg.sender, "Not series creator");
        nftSeries[seriesId].isActive = !nftSeries[seriesId].isActive;
    }
    
    // 修改系列价格
    function updateSeriesPrice(uint256 seriesId, uint256 newPrice) public {
        require(nftSeries[seriesId].creator == msg.sender, "Not series creator");
        nftSeries[seriesId].price = newPrice;
    }
    
    // NFT市场相关函数
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be positive");
        
        tokenIdToPrice[tokenId] = price;
        isTokenListed[tokenId] = true;
        
        emit NFTListed(tokenId, price, msg.sender);
    }
    
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        require(isTokenListed[tokenId], "Token not listed");
        uint256 price = tokenIdToPrice[tokenId];
        require(msg.value >= price, "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own token");
        
        uint256 fee = (price * platformFee) / 1000;
        uint256 sellerAmount = price - fee;
        
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(sellerAmount);
        
        isTokenListed[tokenId] = false;
        delete tokenIdToPrice[tokenId];
        
        emit NFTSold(tokenId, price, seller, msg.sender);
    }
    
    function unlistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(isTokenListed[tokenId], "Token not listed");
        
        isTokenListed[tokenId] = false;
        delete tokenIdToPrice[tokenId];
        
        emit NFTUnlisted(tokenId);
    }
    
    // 平台管理函数
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    function setPlatformFee(uint256 _fee) public onlyOwner {
        require(_fee <= 100, "Fee too high"); // 最高10%
        platformFee = _fee;
    }
    
    function setDailyMintLimit(uint256 _limit) public onlyOwner {
        dailyMintLimit = _limit;
    }
    
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
}