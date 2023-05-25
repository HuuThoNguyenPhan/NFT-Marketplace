///0x5FbDB2315678afecb367f032d93F642f64180aa3
//0x5FbDB2315678afecb367f032d93F642f64180aa3

import nftMarketplace from "./NFTMarketplace.json";
import transferFunds from "./TransferFunds.json";
import nftFactory from "./NFTFactory.json";
import auction from "./Auction.json";
//NFT MARKETPLACE
export const NFTMarketplaceAddress =
  "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570";
export const NFTMarketplaceABI = nftMarketplace.abi;
export const FactoryABI = nftFactory.abi;

export const AuctionAddress =
  "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
export const AuctionABI = auction.abi;

//TRANSFER FUNDS
export const transferFundsAddress =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const transferFundsABI = transferFunds.abi;


