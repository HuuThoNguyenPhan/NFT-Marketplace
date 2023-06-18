const Address = require("../models/address");
const Product = require("../models/ProductModel.js");
const { ethers } = require("ethers");
const { abi } = require("../config/abi/NFTMarketplace.json");
const {
  setObject,
  updateObject,
  deleteObject,
  deleteAllObject,
} = require("../config/redis-connect");

class NFTMarketplace {
  static instance = null;
  constructor(
    contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  ) {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, abi, wallet);
    this.registerMarketItemCreatedListener("MarketItemCreated", null);
    // this.registerMarketItemCreatedListener("resellItem", null);
    // this.registerMarketItemCreatedListener("buyItem", true);
  }

  registerMarketItemCreatedListener(nameEvent, updateProperties) {
    this.contract.once(
      nameEvent,
      async (tokenId, seller, owner, price, sold, idMG) => {
        price = ethers.formatEther(price);
        console.log(
          `Token nft${tokenId} created by ${seller} for ${price} ETH`
        );
        this.useRedis(
          tokenId,
          seller,
          owner,
          price,
          sold,
          idMG,
          updateProperties
        );
      }
    );
  }
  async useRedis(tokenId, seller, owner, price, sold, idMG, updateProperties) {
    const nftObject = {
      tokenId,
      seller,
      owner,
      price,
      sold,
    };
    if (updateProperties) {
      deleteObject(`nft${tokenId}`);
    } else {
      idMG = idMG.toString().slice(38);
      const procduc = await Product.findById(idMG);
      const Object = Object.fromEntries(
        Object.entries(product.toObject()).filter(([key]) =>
          ["_id", "__v"].includes(key)
        )
      );
      setObject(`nft${tokenId}`, nftObject);
      setObject(`nft${tokenId}`, Object);
    }
  }
  async buyToken(tokenId, price) {
    const buyTx = await this.contract.buyToken(tokenId, { value: price });
    await buyTx.wait();
  }

  async getBalance() {
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  async fetchNFTs() {
    const nfts = await this.contract.fetchMarketItems();
    //get tokens url from nft

    deleteAllObject();
    for (const nft of nfts) {
      this.useRedis(
        nft.tokenId,
        nft.seller,
        nft.owner,
        ethers.formatEther(nft.price),
        nft.sold,
        "bug",
        null
      );
    }
    return nfts;
  }

  static async getInstance() {
    if (!NFTMarketplace.instance) {
      const contractAddress = await Address.findById(
        "646b745a80a41c027c2ba7bd"
      );
      const address = contractAddress.nftmarketplaceAddress;
      console.log("first");
      const privateKey =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      NFTMarketplace.instance = new NFTMarketplace(address, privateKey);
    }
    return NFTMarketplace.instance;
  }
}

module.exports = { NFTMarketplace };
