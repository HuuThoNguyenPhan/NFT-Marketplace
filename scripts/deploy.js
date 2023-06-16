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
    Auction.deploy(nftFactory.address),
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
    transferFundsAddress: transferFunds.address,
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
    [
      "http://localhost:5000/api/v1/products/647eb50474bfa401074e5304",
      "http://localhost:5000/api/v1/products/647eb50674bfa401074e5306",
    ],
    ["http://localhost:5000/api/v1/products/647eb68d74bfa401074e5317"],
    ["http://localhost:5000/api/v1/products/647eb75d74bfa401074e532a"],
    ["http://localhost:5000/api/v1/products/647eba6d320f8e7d807cb009"],
    [
      "http://localhost:5000/api/v1/products/647ebb84320f8e7d807cb034",
      "http://localhost:5000/api/v1/products/647ebb89320f8e7d807cb036",
    ],
    ["http://localhost:5000/api/v1/products/647ebc7b320f8e7d807cb084"],
    ["http://localhost:5000/api/v1/products/647ebd3d320f8e7d807cb0a1"],
    ["http://localhost:5000/api/v1/products/647ebe00320f8e7d807cb0dd"],
    [
      "http://localhost:5000/api/v1/products/647ec2be320f8e7d807cb247",
      "http://localhost:5000/api/v1/products/647ec2c7320f8e7d807cb249",
      "http://localhost:5000/api/v1/products/647ec2d0320f8e7d807cb24b",
      "http://localhost:5000/api/v1/products/647ec2d9320f8e7d807cb24d",
      "http://localhost:5000/api/v1/products/647ec2e2320f8e7d807cb24f",
    ],
    ["http://localhost:5000/api/v1/products/647f3ccd320f8e7d807cb2c4"],
    ["http://localhost:5000/api/v1/products/647f3d4a320f8e7d807cb2f1"],
    ["http://localhost:5000/api/v1/products/647f4fb0dae5038384733a89"],
    [
      "http://localhost:5000/api/v1/products/647ff896bd274d5223e70017",
      "http://localhost:5000/api/v1/products/647ff89abd274d5223e70019",
      "http://localhost:5000/api/v1/products/647ff89dbd274d5223e7001b",
      "http://localhost:5000/api/v1/products/647ff8a1bd274d5223e7001d",
    ],
    [
      "http://localhost:5000/api/v1/products/647ffa5abd274d5223e70056",
      "http://localhost:5000/api/v1/products/647ffa64bd274d5223e70058",
      "http://localhost:5000/api/v1/products/647ffa6ebd274d5223e7005a",
      "http://localhost:5000/api/v1/products/647ffa79bd274d5223e7005c",
    ],
    ["http://localhost:5000/api/v1/products/647ffc35bd274d5223e700dd"],
    [
      "http://localhost:5000/api/v1/products/647ffe41bd274d5223e70161",
      "http://localhost:5000/api/v1/products/647ffe45bd274d5223e70163",
    ],
    ["http://localhost:5000/api/v1/products/647ffeadbd274d5223e701aa"],
    ["http://localhost:5000/api/v1/products/64800044bd274d5223e701f3"],
    [
      "http://localhost:5000/api/v1/products/648008e4bd274d5223e703ca",
      "http://localhost:5000/api/v1/products/648008efbd274d5223e703cc",
    ],
    [
      "http://localhost:5000/api/v1/products/64800ae0bd274d5223e7051e",
      "http://localhost:5000/api/v1/products/64800afcbd274d5223e70520",
    ],
  ];

  await Promise.all([
    nftMarketplace
      .connect(address2)
      .createToken(
        tokens[0],
        hre.ethers.utils.parseUnits("0.05", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address1)
      .createToken(
        tokens[1],
        hre.ethers.utils.parseUnits("230.323", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[2],
        hre.ethers.utils.parseUnits("6759", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address1)
      .createToken(
        tokens[3],
        hre.ethers.utils.parseUnits("0.08", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address2)
      .createToken(
        tokens[4],
        hre.ethers.utils.parseUnits("0.1", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address1)
      .createToken(
        tokens[5],
        hre.ethers.utils.parseUnits("110", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[6],
        hre.ethers.utils.parseUnits("55.5", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address2)
      .createToken(
        tokens[7],
        hre.ethers.utils.parseUnits("100.365", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address1)
      .createToken(
        tokens[8],
        hre.ethers.utils.parseUnits("0.025", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[9],
        hre.ethers.utils.parseUnits("220.65", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address2)
      .createToken(
        tokens[10],
        hre.ethers.utils.parseUnits("999.99", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),

    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[11],
        hre.ethers.utils.parseUnits("1000.99", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[12],
        hre.ethers.utils.parseUnits("0.001", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[13],
        hre.ethers.utils.parseUnits("0.035", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[14],
        hre.ethers.utils.parseUnits("50.99", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[15],
        hre.ethers.utils.parseUnits("0.025", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[16],
        hre.ethers.utils.parseUnits("99.99", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
    nftMarketplace
      .connect(address3)
      .createToken(
        tokens[17],
        hre.ethers.utils.parseUnits("100.99", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
      nftMarketplace
      .connect(address3)
      .createToken(
        tokens[18],
        hre.ethers.utils.parseUnits("35.456", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
      nftMarketplace
      .connect(address3)
      .createToken(
        tokens[19],
        hre.ethers.utils.parseUnits("20.156", "ether"),
        1,
        false,
        { value: "25000000000000000" }
      ),
  ]);

  await changeBreed(
    "A",
    tokens[0].map((item) => item.slice(38))
  );
  await changeBreed(
    "B",
    tokens[1].map((item) => item.slice(38))
  );
  await changeBreed(
    "C",
    tokens[2].map((item) => item.slice(38))
  );
  await changeBreed(
    "D",
    tokens[3].map((item) => item.slice(38))
  );
  await changeBreed(
    "E",
    tokens[4].map((item) => item.slice(38))
  );
  await changeBreed(
    "F",
    tokens[5].map((item) => item.slice(38))
  );
  await changeBreed(
    "G",
    tokens[6].map((item) => item.slice(38))
  );
  await changeBreed(
    "H",
    tokens[7].map((item) => item.slice(38))
  );
  await changeBreed(
    "I",
    tokens[8].map((item) => item.slice(38))
  );
  await changeBreed(
    "J",
    tokens[9].map((item) => item.slice(38))
  );
  await changeBreed(
    "K",
    tokens[10].map((item) => item.slice(38))
  );
  await changeBreed(
    "L",
    tokens[12].map((item) => item.slice(38))
  );
  await changeBreed(
    "M",
    tokens[13].map((item) => item.slice(38))
  );
  await changeBreed(
    "N",
    tokens[14].map((item) => item.slice(38))
  );
  await changeBreed(
    "O",
    tokens[15].map((item) => item.slice(38))
  );
  await changeBreed(
    "P",
    tokens[16].map((item) => item.slice(38))
  );
  await changeBreed(
    "Q",
    tokens[17].map((item) => item.slice(38))
  );
  await changeBreed(
    "R",
    tokens[18].map((item) => item.slice(38))
  );
  await changeBreed(
    "S",
    tokens[19].map((item) => item.slice(38))
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
