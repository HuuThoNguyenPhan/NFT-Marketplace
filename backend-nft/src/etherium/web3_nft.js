const Address = require("../models/address");
const { ethers } = require("ethers");
const { abi } = require("../config/abi/NFTFactory.json");
const Product = require("../models/ProductModel.js");
const {
  setObject,
  updateObject,
  deleteObject,
  deleteAllObject,
} = require("../config/redis-connect");

class NFTFactory {
  static instance = null;
  constructor(
    contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  ) {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, abi, wallet);
    this.registerMarketItemCreatedListener("MarketItemCreated", null);
    this.registerMarketItemCreatedListener("updateSale", true);
  }
  static async getInstance() {
    if (!NFTFactory.instance) {
      const contractAddress = await Address.findById(
        "646b745a80a41c027c2ba7bd"
      );
      const address = contractAddress.nftFactory;
      console.log("second");
      const privateKey =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      NFTFactory.instance = new NFTFactory(address, privateKey);
    }
    return NFTFactory.instance;
  }
  async getTokenUrl(tokenid) {
    const url = await this.contract.getTokenURI(tokenid);
    return url;
  }
  registerMarketItemCreatedListener(nameEvent, updateProperties) {
    this.contract.on(
      nameEvent,
      async (
        tokenId,
        seller,
        owner,
        price,
        sold,
        idMG,
        royalties,
        author,
        isauction
      ) => {
        price = ethers.formatEther(price);
        if (nameEvent == "MarketItemCreated") {
          console.log("m")
          this.useRedis(
            tokenId,
            seller,
            owner,
            price,
            sold,
            idMG,
            updateProperties,
            royalties,
            author,
            isauction
          );
        } else if (nameEvent == "updateSale") {
          console.log("u")
          this.useRedis(
            tokenId,
            seller,
            owner,
            price,
            sold,
            idMG,
            updateProperties,
            royalties,
            author,
            idMG,
          );
        }
      }
    );
  }

  async useRedis(
    tokenId,
    seller,
    owner,
    price,
    sold,
    idMG,
    updateProperties,
    royalties,
    author,
    isauction
  ) {
    const nftObject = {
      tokenId,
      seller,
      owner,
      price,
      sold,
      royalties,
      author,
      isauction,
    };
    if (updateProperties) {
      updateObject(`nft${tokenId}`, "sold", sold);
      updateObject(`nft${tokenId}`, "price", price);
      updateObject(`nft${tokenId}`, "seller", seller);
      updateObject(`nft${tokenId}`, "isauction", isauction);
      updateObject(`nft${tokenId}`, "owner", owner);
      console.log(sold)
    } else {
      idMG = idMG.toString().slice(38);
      const product = await Product.findById(idMG);

      const Object = product.toObject();
      Object.image =
        "https://gateway.pinata.cloud/ipfs/" + Object.image.slice(7);
      Object.createAt = new Date(Object.createAt).toLocaleDateString();
      setObject(`nft${tokenId}`, nftObject);
      setObject(`nft${tokenId}`, Object);
    }
  }
}

module.exports = { NFTFactory };
