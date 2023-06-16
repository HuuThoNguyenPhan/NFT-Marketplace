import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { Category, Loader } from "../components/componentsindex";
import NFTDetailsPage from "../components/NFTDetailsPage/NFTDetailsPage";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NFTDetails = () => {
  const { fetchDetailAuction, getContract } = useContext(NFTMarketplaceContext);
  const [contract, setContract] = useState(null);
  const [price, setPrice] = useState(0);
  const [lastBid, setlastBid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
    active: "",
    price: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.auctionId) {
      fetchDetailAuction(router.query.auctionId).then((res) => {
        setNft(res);
        
        setIsLoading(false);
      });
    } else {
      setNft(router.query);
      setIsLoading(false);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.query.auctionId) {
      getContract().then((res) => {
        setContract(res);
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.query.auctionId && contract) {
      const filter = contract.filters.join();
      contract.on(filter, (bidder, amount, auctionId, event) => {
        auctionId = auctionId.toNumber();
        amount = ethers.utils.formatUnits(amount.toString(), "ether");
        if (auctionId == router.query.auctionId) {
          setPrice(amount);
          setlastBid(bidder);
        }
      });
    }
    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [router.isReady, contract]);

  return (
    <>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" , alignItems: "center", height: "100vh"}}>
          <Loader/>
        </div>
      ) : (
        <div>
          <NFTDetailsPage nft={nft} lastBid={price} lastBidder={lastBid} />
          <Category />
        </div>
      )}
    </>
  );
};

export default NFTDetails;
