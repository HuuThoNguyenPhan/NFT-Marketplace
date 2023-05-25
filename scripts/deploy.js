const hre = require("hardhat");
const axios = require("axios");

async function changeBreed(name, item) {
  const time = name + new Date().getTime();
  let header = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = JSON.stringify({
    time: name + time.toString(),
    ids: item,
  });
  let req = {
    url: "http://localhost:5000/api/v1/products/changeBreed",
    method: "POST",
    headers: header,
    data: body,
  };

  let response = await axios.request(req);
}

async function main() {
  const [address1, address2, address3] = await hre.ethers.getSigners();
  const price = hre.ethers.utils.parseUnits("100", "ether");

  const [NFTFactory, NFTMarketplace, Auction, TransferFunds] =
    await Promise.all([
      hre.ethers.getContractFactory("NFTFactory"),
      hre.ethers.getContractFactory("NFTMarketplace"),
      hre.ethers.getContractFactory("Auction"),
      hre.ethers.getContractFactory("TransferFunds"),
    ]);

  const nftFactory = await NFTFactory.deploy();
  const [nftMarketplace, auction, transferFunds] = await Promise.all([
    NFTMarketplace.deploy(nftFactory.address),
    Auction.deploy(nftFactory.address,),
    TransferFunds.deploy(),
  ]);

  await Promise.all([
    nftFactory.deployed(),
    nftMarketplace.deployed(),
    auction.deployed(),
    transferFunds.deployed(),
  ]);

  let header = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = JSON.stringify({
    nftmarketplaceAddress: nftMarketplace.address,
    nftFactory: nftFactory.address,
    auctionAddress: auction.address,
    transferFundsAddress: transferFunds.address
  });
  let req = {
    url: "http://localhost:5000/api/v1/address/update",
    method: "PUT",
    headers: header,
    data: body,
  };
  await axios.request(req);
  console.log(`deployed contract nftFactory: ${nftFactory.address}`);
  console.log(`deployed contract auction: ${auction.address}`);
  console.log(`deployed contract TransferFunds: ${transferFunds.address}`);
  console.log(`deployed contract Address ${nftMarketplace.address}`);

  const tokens = [
    ["http://localhost:5000/api/v1/products/643d65869bd902d0d0aa7183"],
    [
      "http://localhost:5000/api/v1/products/643d680a9bd902d0d0aa71bd",
      "http://localhost:5000/api/v1/products/643d680e9bd902d0d0aa71bf",
    ],
    [
      "http://localhost:5000/api/v1/products/643d686d9bd902d0d0aa71c7",
      "http://localhost:5000/api/v1/products/643d686f9bd902d0d0aa71c9",
      "http://localhost:5000/api/v1/products/643d68739bd902d0d0aa71cb",
    ],
  ];

  await Promise.all([
    nftMarketplace
      .connect(address2)
      .createToken(tokens[0], price, 1 , false, { value: "25000000000000000" }),
    nftMarketplace
      .connect(address1)
      .createToken(tokens[1], price, 1, false, { value: "25000000000000000" }),
    nftMarketplace
      .connect(address1)
      .createToken(tokens[2], price, 1 , false, { value: "25000000000000000" }),
  ]);

  await changeBreed("A", tokens[0].map((item) => item.slice(38)));
  await changeBreed("B", tokens[1].map((item) => item.slice(38)));
  await changeBreed("C", tokens[2].map((item) => item.slice(38)));
  console.log(await nftMarketplace.getListingPrice());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
