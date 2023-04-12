import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BsImage } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../../components/componentsindex";
import images from "../../../assets/img";

const NFTCardTwo = ({ NFTData }) => {
  const [like, setLike] = useState(false);
  const [likeInc, setLikeInc] = useState(21);

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
        break;
      case "audio":
        return (
          <div className={Style.NFTCardTwo_box_img}>
            <Image
              src={images.creatorbackground10}
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
        break;
      case "video":
        return (
          <video width="200" height="150" controls style={{ margin: "0 auto" }}>
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
        break;
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
              <div className={Style.NFTCardTwo_box_like_box}>
                <div className={Style.NFTCardTwo_box_like_box_box}>
                  <p onClick={() => likeNFT()}>
                    {like ? <AiOutlineHeart /> : <AiFillHeart />}
                    <span>{likeInc + 1}</span>
                  </p>
                </div>
              </div>
            </div>

            {renderPreview(el.typeFile, el.image)}

            <div className={Style.NFTCardTwo_box_info}>
              <div className={Style.NFTCardTwo_box_info_left}>
                <p>{el.name}</p>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_price}>
              <div className={Style.NFTCardTwo_box_price_box}>
                <small>Giá hiện tại</small>
                <p>{el.price} ETH</p>
              </div>
              <p className={Style.NFTCardTwo_box_price_stock}>
                <MdTimer /> <span>{i + 1} hours left</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCardTwo;
