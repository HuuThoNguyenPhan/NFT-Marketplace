const cron = require("node-cron");
const { NFTAuction } = require("../etherium/web3_auction.js");

const { NFTFactory } = require("../etherium/web3_nft.js");

//  */10 * * * * *"
const auctionJob = cron.schedule("0 * * * *", async () => {
  try {
    const auction = await NFTAuction.getInstance();

    auction.autoFinishAuction();
    console.log("cron is running");
  } catch (error) {
    console.log(error);
  }
});

module.exports = auctionJob;
