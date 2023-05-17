const hre = require("hardhat");
const axios = require("axios");

async function changeBreed(name,item){
  const time = name + new Date().getTime()
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
  let tokenId = await nftMarketplace
    .connect(address2)
    .createToken(
      ["http://localhost:5000/api/v1/products/643d65869bd902d0d0aa7183"],
      price,
      { value: "25000000000000000" }
    );

  let tokenId2 = await nftMarketplace
    .connect(address1)
    .createToken(
      [
        "http://localhost:5000/api/v1/products/643d680a9bd902d0d0aa71bd",
        "http://localhost:5000/api/v1/products/643d680e9bd902d0d0aa71bf",
      ],
      price,
      { value: "25000000000000000" }
    );
  let tokenId3 = await nftMarketplace
    .connect(address1)
    .createToken(
      [
        "http://localhost:5000/api/v1/products/643d686d9bd902d0d0aa71c7",
        "http://localhost:5000/api/v1/products/643d686f9bd902d0d0aa71c9",
        "http://localhost:5000/api/v1/products/643d68739bd902d0d0aa71cb",
      ],
      price,
      { value: "25000000000000000" }
    );
  let check = await nftMarketplace.getTokenId();
  await changeBreed("A",[
    "643d65869bd902d0d0aa7183"
  ])
  await changeBreed("B",[
    "643d680a9bd902d0d0aa71bd",
    "643d680e9bd902d0d0aa71bf",
  ],)
  await changeBreed("C",[
    "643d686d9bd902d0d0aa71c7",
    "643d686f9bd902d0d0aa71c9",
    "643d68739bd902d0d0aa71cb",
  ],)
  // let tokenId = await nftMarketplace.createToken()
  console.log(check);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
