import React from "react";

//INTERNAL IMPORT
import { NFTDescription, NFTDetailsImg, } from "./NFTDetailsIndex";
import Style from "./NFTDetailsPage.module.css";

const NFTDetailsPage = ({ nft, lastBid, lastBidder }) => {
  return (
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
        <NFTDetailsImg nft={nft} />
        <NFTDescription lastBid={lastBid} lastBidder={lastBidder} nft={nft}/>
      </div>
    </div>
  );
};

export default NFTDetailsPage;
