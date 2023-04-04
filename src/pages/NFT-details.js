import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";


import { Category } from "../components/componentsindex";
import NFTDetailsPage from "../components/NFTDetailsPage/NFTDetailsPage";

const NFTDetails = () => {

  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
  }, [router.isReady]);

  return (
    <div>
      <NFTDetailsPage nft={nft} />
      <Category />
    </div>
  );
};

export default NFTDetails;
