import React, { useEffect, useState, useContext } from "react";

//INTRNAL IMPORT
import Style from "../styles/searchPage.module.css";
import {
  Slider,
  Loader,
  AudioLive,
  NFTCard,
} from "../components/componentsindex";
import { SearchBar } from "../components/SearchPage/searchBarIndex";
import { Filter } from "../components/componentsindex";

import { Banner } from "../components/collectionPage/collectionIndex";
import images from "../assets/img";

import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs, setError, currentAccount, fetchAuction } = useContext(
    NFTMarketplaceContext
  );
  const [nft, setNft] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    try {
      fetchNFTs().then((items) => {
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

          setNfts(finalItems.reverse());
          setNftsCopy(finalItems);
        }
      });
    } catch (error) {
      setError("Hãy tải lại trình duyệt", error);
    }

    fetchAuction(true).then((items) => {
      setAuctions(items);
      console.log(items);
    });
  }, []);

  const onHandleSearch = (value) => {
    const filteredNFTS = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredNFTS.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTS);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  function onHandleFilter(video, image, music, file) {
    if (video && image && music && file) {
      setNfts(nftsCopy);
      return;
    }
    const filteredNFTS = [];
    if (!file)
      filteredNFTS = filteredNFTS.concat(
        nftsCopy.filter((e) => e.typeFile == "application")
      );
    if (!video)
      filteredNFTS = filteredNFTS.concat(
        nftsCopy.filter((e) => e.typeFile == "video")
      );
    if (!music)
      filteredNFTS = filteredNFTS.concat(
        nftsCopy.filter((e) => e.typeFile == "audio")
      );
    if (!image)
      filteredNFTS = filteredNFTS.concat(
        nftsCopy.filter((e) => e.typeFile == "image")
      );

    console.log(filteredNFTS + "aaaaaaaaa");
    setNfts(filteredNFTS);
  }

  // const collectionArray = [
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1,
  //   images.nft_image_2,
  //   images.nft_image_3,
  //   images.nft_image_1,
  //   images.nft_image_2,
  // ];
  return (
    <div className={Style.searchPage}>
      <Banner bannerImage={images.creatorbackground2} />
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <div>{nft}</div>
      <Filter setNft={setNft} onHandleFilter={onHandleFilter} />
      {nft ? (
        nfts.length == 0 ? (
          <Loader />
        ) : (
          <NFTCard NFTData={nfts} />
        )
      ) : auctions.length == 0 ? (
        <Loader />
      ) : (
        <NFTCard NFTData={auctions} />
      )}
    </div>
  );
};

export default searchPage;
