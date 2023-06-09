import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./SliderCard.module.css";
import images from "../../../assets/img";
import LikeProfile from "../../LikeProfile/LikeProfile";

const SliderCard = ({ el, i }) => {
  return (
    <motion.div className={Style.sliderCard}>
      <div className={Style.sliderCard_box}>
        <motion.div className={Style.sliderCard_box_img}>
          <Image
            src={el.image}
            className={Style.sliderCard_box_img_img}
            alt="slider profile"
            width={500}
            height={300}
            objectFit="contain"
          />
        </motion.div>
        <div className={Style.sliderCard_box_title}>
          <p>{el.name} #{el.tokenId}</p>
          <div className={Style.sliderCard_box_title_like}>
            {/* <LikeProfile /> */}
            <small>{el.limit || 1} trong kho</small>
          </div>
        </div>

        <div className={Style.sliderCard_box_price}>
          <div className={Style.sliderCard_box_price_box}>
            <small>Giá hiện tại</small>
            <p>{el.lastPrice || el.price} ETH</p>
          </div>

          <div className={Style.sliderCard_box_price_time}>
            <small>Reaming time</small>
            <p>
            {el.remaining}
              {/* {i + 1}h : 15m : {i + 4}0s */}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SliderCard;
