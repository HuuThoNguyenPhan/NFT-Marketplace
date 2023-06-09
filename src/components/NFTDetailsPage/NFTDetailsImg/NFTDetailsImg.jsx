import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsImages } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import images from "../../../assets/img";

import Style from "./NFTDetailsImg.module.css";

const NFTDetailsImg = ({ nft }) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const [like, setLike] = useState(false);
  const openDescription = () => {
    if (!description) {
      setDescription(true);
    } else {
      setDescription(false);
    }
  };

  const openDetails = () => {
    if (!details) {
      setDetails(true);
    } else {
      setDetails(false);
    }
  };

  const likeNFT = () => {
    if (!like) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  const renderPreview = (typeFile, fileUrl) => {
    switch (typeFile) {
      case "image":
        return (
          <Image
            className={Style.image}
            src={fileUrl}
            alt="nft image"
            width={700}
            height={800}
            objectFit="contain"
          />
        );

      case "audio":
        return (
          <div className={Style.image_audio}>
            <Image
              src={images.nft_music}
              alt="nft image"
              width={700}
              height={800}
              objectFit="cover"
            />
            <audio
              className={Style.audio}
              controls
              style={{ margin: "0 auto" }}
            >
              <source src={fileUrl} />
            </audio>
          </div>
        );

      case "video":
        return (
          <video
            width="100%"
            height="100%"
            controls
            style={{ margin: "0 auto" }}
          >
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
      default:
        return (
          <Image
            className={Style.image}
            src={images.file}
            alt="nft image"
            width={700}
            height={800}
            objectFit="contain"
          />
        );
    }
  };

  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_img}>
            {renderPreview(nft.typeFile, nft.image)}
            {/* <Image
              src={nft.image}
              className={Style.NFTDetailsImg_box_NFT_img_img}
              alt="NFT image"
              width={700}
              height={800}
              objectFit="cover"
            /> */}
          </div>
        </div>

        <div
          className={Style.NFTDetailsImg_box_description}
          onClick={() => openDescription()}
        >
          <p>Mô tả</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {description && (
          <div className={Style.NFTDetailsImg_box_description_box}>
            <p align="justify">{nft.description}</p>
          </div>
        )}

        <div
          className={Style.NFTDetailsImg_box_details}
          onClick={() => openDetails()}
        >
          <p>Chi tiết</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>

        {details && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <small>{nft.typeFile} ({nft.size}MB)</small>
            <p>
              <small>Địa chỉ hợp đồng:</small>
              <br></br>
              {nft.seller}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetailsImg;
