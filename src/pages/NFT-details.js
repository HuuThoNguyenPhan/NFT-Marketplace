import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Category } from "../components/componentsindex";
import NFTDetailsPage from "../components/NFTDetailsPage/NFTDetailsPage";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NFTDetails = () => {
  const {fetchDetailAuction} = useContext(NFTMarketplaceContext);
  const [nft, setNft] = useState({
    tokenId: "",
    image: "",
    name: "",
    description: "",
    tokenURI: "",
    typeFile: "",
    breed: "",
    size: "",
    limit: "",
    auctioneer: "",
    initPrice: "",
    previousBidder: "",
    lastPrice: "",
    lastBidder: "",
    startTime: "",
    endTime: "",
    remaining: "",
    completed: "",
    active: "",
    auctionId: "",
    owner: "",
    seller: "",
    author: "",
    royalties: "",
    completed: "",
    active:"",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    console.log(router.query.auctionId);
    if(router.query.auctionId){
      fetchDetailAuction(router.query.auctionId).then((res) => {
        console.log(res);
        setNft(res);
      });
    }
    else{
      setNft(router.query);
    }
  }, [router.isReady]);

  return (
    <div>
    <div>{nft.auctionId}</div>
      <NFTDetailsPage nft={nft} />
      <Category />
    </div>
  );
};

export default NFTDetails;
