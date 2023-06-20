import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../../components/componentsindex";
import images from "../../../assets/img";
import { NFTMarketplaceContext } from "../../../../Context/NFTMarketplaceContext";
const NFTCardTwo = ({ NFTData }) => {
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);
  const { addToCart, currentAccount, setError, setOpenError,formatPrice } =
    useContext(NFTMarketplaceContext);
  const handelAddtoCart = (event, el) => {
    event.preventDefault();
    if (!currentAccount) {
      setError("Bạn phải kết nối ví");
      setOpenError(true);
    } else {
      addToCart(
        el.tokenId,
        el.name,
        el.image,
        el.typeFile,
        el.price,
        el.royalites,
        el.author
      );
    }
  };

  const price = 12345656;
  const formattedPrice = formatPrice(price);
  console.log(formattedPrice); // "123.5M" (ví dụ)

  const likeNFT = () => {
    if (!like) {
      setLike(true);
      setLikeInc(23);
    } else {
      setLike(false);
      setLikeInc(23 + 1);
    }
  };

  const renderPreview = (typeFile, fileUrl) => {
    switch (typeFile) {
      case "image":
        return (
          <div className={Style.NFTCardTwo_box_img}>
            <Image
              src={fileUrl}
              alt="nft image"
              width={300}
              height={250}
              objectFit="contain"
            />
          </div>
        );
      case "audio":
        return (
          <div className={Style.NFTCardTwo_box_img}>
            <Image
              src={images.nft_music}
              alt="nft image"
              width={400}
              height={350}
              objectFit="cover"
            />
            <audio
              id="myaudio"
              className={Style.NFTCardTwo_box_img_audio}
              controls
            >
              <source src={fileUrl} />
            </audio>
          </div>
        );
      case "video":
        return (
          <video className={Style.NFTCardTwo_box_video} controls>
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
      default:
        return (
          <div className={Style.NFTCardTwo_box_img}>
            <Image
              src={images.file}
              alt="nft image"
              width={400}
              height={350}
              objectFit="contain"
            />
          </div>
        );
    }
  };

  return (
    <div className={Style.NFTCardTwo}>
      {NFTData.map((el, i) => (
        <Link
          href={{ pathname: "/NFT-details", query: el }}
          state={el}
          key={i + 1}
        >
          <div className={Style.NFTCardTwo_box} key={i + 1}>
            <div className={Style.NFTCardTwo_box_like}>
              {!el.auctionId && el.only == true && (
                <div className={Style.NFTCardTwo_box_like_box_box}>
                  <button
                    className={Style.NFTCardTwo_btnBuy_addToCart}
                    onClick={(event) => handelAddtoCart(event, el)}
                  >
                    <AiOutlineShoppingCart color="white" size={20} />
                  </button>
                </div>
              )}
            </div>

            {renderPreview(el.typeFile, el.image)}

            <div className={Style.NFTCardTwo_box_info}>
              <div className={Style.NFTCardTwo_box_info_left}>
                <p>
                  {el.name} #{el.tokenId}
                </p>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_price}>
              <div className={Style.NFTCardTwo_box_price_box}>
                <small>Giá hiện tại</small>
                <p>{formatPrice(el.price,7)} ETH</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCardTwo;
