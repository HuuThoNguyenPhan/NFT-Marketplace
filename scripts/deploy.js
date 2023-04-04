const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.deployed();

  // //TRANSFER FUNDS
  // const TransferFunds = await hre.ethers.getContractFactory("TransferFunds");
  // const transferFunds = await TransferFunds.deploy();

  // await transferFunds.deployed();

  console.log(` deployed contract Address ${nftMarketplace.address}`);
  // console.log(` deployed contract Address ${transferFunds.address}`);
  // let listingPrice = await nftMarketplace.getListingPrice()
  const [address1, address2, address3] = await hre.ethers.getSigners();
  const price = hre.ethers.utils.parseUnits("100","ether")
  let tokenId = await nftMarketplace
    .connect(address2)
    .createToken(
      "https://gateway.pinata.cloud/ipfs/QmNepw7H7E2asD5NbNkgL3KobsWVXZFVD2Ze6Ph42bsBwS",
      price,
      { value: "25000000000000000" }
    );
  let tokenId2 = await nftMarketplace
    .connect(address2)
    .createToken(
      "https://gateway.pinata.cloud/ipfs/QmNepw7H7E2asD5NbNkgL3KobsWVXZFVD2Ze6Ph42bsBwS",
      price,
      { value: "25000000000000000" }
    );
    let check = await nftMarketplace.getTokenId()
  // let tokenId = await nftMarketplace.createToken()
  console.log(check);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
