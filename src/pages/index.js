import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  Slider,
  Loader,
} from "../components/componentsindex";
import { getTopCreators } from "../utils/TopCreators/TopCreators";

const Home = () => {

  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  // useEffect(() => {
  //   // if (currentAccount) {
  //   fetchNFTs().then((items) => {
  //     console.log(nfts);
  //     setNfts(items.reverse());
  //     setNftsCopy(items);
  //   });
  //   // }
  // }, []);

  //CREATOR LIST

  return (
    <div className={Style.homePage}>
      <HeroSection />
      {/* <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      /> */}
      {/* {creators.length == 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )} */}
      
      <Title
        heading="Thể loại"
        paragraph="Xem các sản phẩm NFT theo thể loại."
      />
      <Category />
      <Slider />
      <Collection />
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCard NFTData={nfts} />}
      <NFTCard />

      
    </div>
  );
};

export default Home;
