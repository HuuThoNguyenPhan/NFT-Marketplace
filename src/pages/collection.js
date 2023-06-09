import React from "react";

//INTERNAL IMPORT
import Style from "../styles/collection.module.css";
import images from "../assets/img";
import {
  Banner,
  CollectionProfile,
  NFTCardTwo,
} from "../components/collectionPage/collectionIndex";
import { Slider} from "../components/componentsindex";
import Filter from "../components/Filter/Filter";

const collection = () => {
  const collectionArray = [
    {
      image: images.nft_image_1,
    },
    {
      image: images.nft_image_2,
    },
    {
      image: images.nft_image_3,
    },
    {
      image: images.nft_image_1,
    },
    {
      image: images.nft_image_2,
    },
    {
      image: images.nft_image_3,
    },
    {
      image: images.nft_image_1,
    },
    {
      image: images.nft_image_2,
    },
  ];
  return (
    <div className={Style.collection}>
      <Banner bannerImage={images.creatorbackground1} />
      <CollectionProfile />
      <Filter />
      {/* <NFTCardTwo NFTData={collectionArray} /> */}

      <Slider />
    </div>
  );
};

export default collection;
