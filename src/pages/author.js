import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import Style from "../styles/author.module.css";
import { Banner } from "../components/collectionPage/collectionIndex";
import { Loader, Title } from "../components/componentsindex";
import FollowerTabCard from "../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import images from "../assets/img";
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
} from "../components/authorPage/componentIndex";

import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const author = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount, fetchAuction } = useContext(
    NFTMarketplaceContext
  );
  const router = useRouter();
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
      seller: "7d64gf748849j47fy488444",
    },
    {
      background: images.creatorbackground6,
      user: images.user6,
      seller: "7d64gf748849j47fy488444",
    },
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [auction, setAuction] = useState(false);
  const [endAuction, setEndAuction] = useState(false);
  const [endAuctions,setEndAuctions] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  useEffect(() => {
    fetchAuction(true).then((items) => {
      if(router.query.seller){
        items = items.filter((item) => item.auctioneer.toLocaleLowerCase() == router.query.seller);
      }else{
        items = items.filter((item) => item.auctioneer.toLocaleLowerCase() == currentAccount);
      }
     
      
      setAuctions(items);
    })
  },[router.query.seller,auction]);

  useEffect(() => {
    
    fetchAuction(false).then((items) => {
      console.log(items);
      if(router.query.seller){
        items = items.filter((item) => item.auctioneer.toLocaleLowerCase() == router.query.seller);
      }else{
        items = items.filter((item) => item.auctioneer.toLocaleLowerCase() == currentAccount);
      }
      setEndAuctions(items);
      console.log(items);
    })
  },[router.query.seller,endAuction ]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed", router.query.seller || currentAccount).then(
      (items) => {
        if (items) {
          const finalItems = [];
          for (let i = 0; i < items.length; i++) {
            if (items[i].breed != 1) {
              items[i].count = 1;
              items[i].tokenIds = [];
              items[i].tokenIds.push(items[i].tokenId);
              for (let j = i + 1; j < items.length; j++) {
                if (items[j].breed == items[i].breed) {
                  items[i].count++;
                  items[i].tokenIds.push(items[j].tokenId);
                  items.splice(j, 1);
                  j--;
                }
              }
            }
            finalItems.push(items[i]);
          }
          setNfts(finalItems);
        }
      }
    );
  }, [router.query.seller,collectiables]);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchMyNFTs", router.query.seller || currentAccount).then((items) => {
      if (items) {
        const finalItems = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].breed != 1) {
            items[i].count = 1;
            items[i].tokenIds = [];
            items[i].tokenIds.push(items[i].tokenId);
            for (let j = i + 1; j < items.length; j++) {
              if (items[j].breed == items[i].breed) {
                items[i].count++;
                items[i].tokenIds.push(items[j].tokenId);
                items.splice(j, 1);
                j--;
              }
            }
          }
          finalItems.push(items[i]);
        }
        setMyNFTs(finalItems);
      }
    });
  }, [router.query.seller,created]);

  return (
    <div className={Style.author}>
      <Banner bannerImage={images.creatorbackground2} />
      <AuthorProfileCard currentAccount={router.query.seller || currentAccount} />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setAuction={setAuction}
        setEndAuction={setEndAuction}
      />
      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        nfts={nfts}
        myNFTS={myNFTs}
        auctions={auctions}
        auction={auction}
        endAuction={endAuction}
        endAuctions={endAuctions}
      />
      {/* <Title
        heading="Popular Creators"
        paragraph="Click on music icon and enjoy NTF music or audio"
      /> */}
      {/* <div className={Style.author_box}>
        {followerArray.map((el, i) => (
          <FollowerTabCard i={i} el={el} />
        ))}
      </div> */}
    </div>
  );
};

export default author;
