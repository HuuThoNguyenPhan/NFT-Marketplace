const Address = require("../models/address");
const Product = require("../models/ProductModel.js");
const { ethers } = require("ethers");
const { abi } = require("../config/abi/NFTMarketplace.json");
const { NFTFactory } = require("./web3_nft.js");
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
      updateObject(`nft${tokenId}`, "seller", seller);
      updateObject(
        `nft${tokenId}`,
        "owner",
        "0x0000000000000000000000000000000000000000"
      );
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
  async buyToken(tokenId, price) {
    const buyTx = await this.contract.buyToken(tokenId, { value: price });
    await buyTx.wait();
  }

  async getBalance() {
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }
  async changeListingPrice(eth) {
    const price = ethers.utils.parseUnits(eth.price.toString(), "ether");
    await this.contract.updateListingPrice(price);
  }

  async fetchNFTs() {
    const nfts = await this.contract.fetchAllMarketItems();
    //get tokens url from nft
    const contractFactory = await NFTFactory.getInstance();
    deleteAllObject();
    for (const nft of nfts) {
      const url = await contractFactory.getTokenUrl(nft.tokenId);
      this.useRedis(
        nft.tokenId,
        nft.seller,
        nft.owner,
        ethers.formatEther(nft.price),
        nft.sold,
        url,
        null,
        nft.royalties,
        nft.author,
        nft.isauction
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
