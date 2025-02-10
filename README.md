# 使用说明

## 配置网络连接
注意更改了区块链浏览器的链接
### Polygon zkEVM Cardona 测试网配置
```
网络名称: Polygon zkEVM Cardona Testnet
RPC URL: https://rpc.cardona.zkevm-rpc.com
链 ID: 2442
货币符号: ETH
区块浏览器: https://cardona-zkevm.polygonscan.com
```
水龙头：https://faucet.polygon.technology/



## 项目部署

### 本地设置
1. 克隆仓库到本地
2. 复制 `.env.example` 到 `.env`，填入相关信息（如果你懒得用自己的pinata JWT，pinata.txt文件里有我的
4. 安装依赖：
   ```bash
   npm install
   npx hardhat compile
   npm install axios
   npm install react-markdown
   npm install react-select
   ```
5. 运行项目：
   ```bash
   npm run dev
   ```

---

## 部署信息

### 合约地址
```
0x93d5Afc4A62126247a9FB07388d1DEC04ca444Ee
```

### 公链选择
- 已经迁移至 Polygon 测试网络

### 存储方案
- 当前：Pinata
- 计划：web3.storage

## 待优化项目
1. 合约优化：将铸造操作合并为单次交易

## 附录

### Filecoin - Calibration testnet 配置
1. 打开 MetaMask
2. 点击网络选择器
3. 点击"添加网络"
4. 填入下述网络配置信息：
   - 网络名称: Filecoin - Calibration testnet
   - RPC URL: https://api.calibration.node.glif.io/rpc/v1
   - 链 ID: 314159
   - 货币符号: tFIL
   - 区块浏览器: https://calibration.filfox.info

### 获取测试币
前往水龙头领取测试币：https://beryx.io/faucet
