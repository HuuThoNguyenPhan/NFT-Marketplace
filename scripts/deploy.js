const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.deployed();

  // //TRANSFER FUNDS
  const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  const transferFunds = await TransferFunds.deploy();

  await transferFunds.deployed();
  console.log(` deployed contract TransferFunds: ${transferFunds.address}`);

  console.log(` deployed contract Address ${nftMarketplace.address}`);
  // console.log(` deployed contract Address ${transferFunds.address}`);
  // let listingPrice = await nftMarketplace.getListingPrice()
  const [address1, address2, address3] = await hre.ethers.getSigners();
  const price = hre.ethers.utils.parseUnits("100", "ether");
  console.log(price);
  let tokenId = await nftMarketplace
    .connect(address2)
    .createToken(
      ["https://gateway.pinata.cloud/ipfs/QmeTu4GWg66pif69pAyEpL6EZUQc8TTNt7jfbiit6uk312"],
      price,
      { value: "25000000000000000" }
    );
  let tokenId2 = await nftMarketplace
    .connect(address1)
    .createToken(
      ["https://gateway.pinata.cloud/ipfs/QmeTu4GWg66pif69pAyEpL6EZUQc8TTNt7jfbiit6uk312","https://gateway.pinata.cloud/ipfs/QmeTu4GWg66pif69pAyEpL6EZUQc8TTNt7jfbiit6uk312"],
      price,
      { value: "25000000000000000" }
    );
  let check = await nftMarketplace.getTokenId();
  // let tokenId = await nftMarketplace.createToken()
  console.log(check);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
