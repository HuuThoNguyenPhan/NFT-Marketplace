import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Category } from "../components/componentsindex";
import NFTDetailsPage from "../components/NFTDetailsPage/NFTDetailsPage";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const NFTDetails = () => {
  
  const [usd, setUSD] = useState();
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
