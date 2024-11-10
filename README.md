合约地址0x0eDA099BAfD448EE0195e4F8C520CA61ba4CA67a
### 公链选择

优先考虑最低成本: 选择 Polygon PoS 
适合高频小额交易 
用户基础大 

### 存储选择

web3.storage, pinata, NFT.storage都有内容审查。

开发阶段可以先用web3.storage开发。各功能差不多后自建IPFS节点，用自己的服务器。
我目前是用的自己的IPFS节点。

### 配置 MetaMask 以连接到Polygon zkEVM Cardona测试网络

要在 MetaMask 中添加网络：

1. 打开 MetaMask
2. 点击网络选择器
3. 点击"添加网络"
4. 填入上述网络配置信息

以下是 Polygon zkEVM Cardona 测试网的配置信息：

```
网络名称: Polygon zkEVM Cardona Testnet
RPC URL: https://rpc.cardona.zkevm-rpc.com
链 ID: 2442
货币符号: ETH
区块浏览器: https://testnet-zkevm.polygonscan.com
```

水龙头：

https://faucet.polygon.technology/


# Social NFT 合约实现说明

## 主要数据结构

### NFT 系列结构
```solidity
struct NFTSeries {
    address creator;      // 创作者地址
    uint256 maxSupply;   // 最大供应量(0=无限)
    uint256 currentSupply; // 当前供应量
    string baseTokenURI;  // 基础URI
    uint256 price;       // 系列独立价格(0=用平台默认价格)
    bool isActive;       // 系列状态
}
```

### 关键映射
```solidity
mapping(uint256 => NFTSeries) public nftSeries;         // 系列ID => 系列信息
mapping(address => uint256) public dailyMints;          // 用户地址 => 当天铸造数量
mapping(address => uint256) public lastMintDay;         // 用户地址 => 最后铸造日期
mapping(uint256 => uint256) public tokenIdToPrice;      // NFT ID => 挂单价格
mapping(uint256 => bool) public isTokenListed;          // NFT ID => 是否在售
mapping(uint256 => uint256) public tokenIdToSeries;     // NFT ID => 所属系列ID
```

## 铸造流程
1. 用户调用 `mintSeriesNFT(seriesId)`
2. 检查每日限制(modifier checkDailyLimit)：
   ```solidity
   当前日期 = block.timestamp / 86400
   如果 新的一天:
       重置用户铸造数量
   要求 当日铸造数量 < 每日限制(10)
   ```
3. 验证价格和系列状态
4. 铸造NFT并更新数据:
   - 生成新tokenId
   - 铸造NFT给用户
   - 设置tokenURI
   - 更新系列供应量
   - 记录NFT所属系列
   - 更新用户今日铸造数量

## 收益分配比例
- 铸造收益: 创作者70% + 平台30%
- 交易手续费: 2.5%(platformFee = 25)

## 开发注意事项

### 1. 价格处理
- 所有价格相关都用 wei 为单位
- 默认铸造价格 = 0.0001 ETH
- 系列可以设独立价格，设0则用默认价格

### 2. 日期处理
```solidity
// 获取今天日期(从0开始)
uint256 currentDay = block.timestamp / 86400
```

### 3. URI 组装
```solidity
// tokenURI = baseURI + tokenId
string(abi.encodePacked(baseURI, toString(tokenId)))
```

### 4. 核心检查点
- 铸造前检查系列状态 `isActive`
- 所有价格相关操作检查 `msg.value`
- NFT操作前检查所有权 `ownerOf()`
- 系列操作检查创作者权限 

### 5. 测试重点
- 日切时铸造限制重置
- 不同价格系统的铸造
- 收益分配精度
- NFT交易流程
- 各种异常情况的权限检查

### 6. Gas优化建议
- 建议批量铸造时在前端合并交易
- URI可以考虑用固定模版+tokenId
- 价格可以用uint96节省存储
- 状态变量尽量打包存储

## 合约测试覆盖
```javascript
describe("测试分类")
1. NFT系列创建和铸造
   - 创建系列
   - 基础铸造
   - 日限制检查
2. NFT交易
   - 上架
   - 购买
3. 收益分配
   - 铸造收益
   - 交易手续费
```

### 常见问题
1. 为什么不用 safeTransfer?
   - 已用 ReentrancyGuard 防重入
   - 直接 transfer 省 gas
   
2. 系列 ID 从1开始?
   - 是的，0预留，方便检查默认值

3. 收益计算为啥用 1000?
   - 方便算百分比，如70% = 700/1000

差不多就这些，如果还有不明白的随时问我！
