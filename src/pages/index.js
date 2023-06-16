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
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const Home = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    // if (currentAccount) {
    fetchNFTs().then((items) => {
      if(items){
        setNfts(items.reverse());
        setNftsCopy(items);
      }
    });
    // }
  }, []);

  //CREATOR LIST
  const creators = getTopCreators(nfts);

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

      {creators.length == 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )}

      <Title
        heading="Thể loại"
        paragraph="Xem các sản phẩm NFT theo thể loại."
      />
      <Category />
      {/* <Slider nfts={nfts} title="NFTs Ảnh"/>
      <Slider nfts={nfts} title="NFTs Video"/>
      <Slider nfts={nfts} title="NFTs Âm thanh"/>
      <Slider nfts={nfts} title="NFTs các loại tệp khác" /> */}
      {/* <Filter />
      {nfts.length == 0 ? <Loader /> : <NFTCard NFTData={nfts} />} */}
    </div>
  );
};

export default Home;
