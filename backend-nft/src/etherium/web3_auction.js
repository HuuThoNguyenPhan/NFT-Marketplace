const Address = require("../models/address");
const { ethers } = require("ethers");
const { abi } = require("../config/abi/Auction.json");

class NFTAuction {
  static instance = null;
  constructor(
    contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  ) {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, abi, wallet);
  }
  static async getInstance() {
    if (!NFTAuction.instance) {
      const contractAddress = await Address.findById(
        "646b745a80a41c027c2ba7bd"
      );
      const address = contractAddress.auctionAddress;
      console.log("second");
      const privateKey =
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      NFTAuction.instance = new NFTAuction(address, privateKey);
    }
    return NFTAuction.instance;
  }
  async autoFinishAuction() {
    const a = true;
    const auctions = await this.contract.getAuctionByStatus(a);

    const currentTime = new Date().getTime();
    for (const auction of auctions) {
      const { auctionId, endTime, lastBidder } = auction;
      if (endTime > currentTime) continue;
      const method =
        lastBidder === "0x0000000000000000000000000000000000000000"
          ? "cancleAuction"
          : "finishAuction";
      console.log(method);
      await this.contract[method](auctionId);
    }
  }
}

module.exports = { NFTAuction };
