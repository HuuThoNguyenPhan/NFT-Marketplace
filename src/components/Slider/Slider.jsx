import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

//INTERNAL IMPORT
import Style from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";
import images from "../../assets/img";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
const Slider = ({ nfts,title }) => {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const dragSlider = useRef();

  useEffect(() => {
    setWidth(dragSlider.current.scrollWidth - dragSlider.current.offsetWidth);
  });

  const handleScroll = (direction) => {
    const { current } = dragSlider;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction == "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className={Style.slider}>
      <div className={Style.slider_box}>
        <h2>{title}</h2>
        <div className={Style.slider_box_button}>
          <p>Click on play icon & enjoy Nfts Video</p>
          <div className={Style.slider_box_button_btn}>
            <div
              className={Style.slider_box_button_btn_icon}
              onClick={() => handleScroll("left")}
            >
              <TiArrowLeftThick />
            </div>
            <div
              className={Style.slider_box_button_btn_icon}
              onClick={() => handleScroll("right")}
            >
              <TiArrowRightThick />
            </div>
          </div>
        </div>

        <motion.div className={Style.slider_box_itmes} ref={dragSlider}>
          <motion.div
            ref={dragSlider}
            className={Style.slider_box_item}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
          >
            {nfts &&
              nfts.map((el, i) => (
                <div
                  onClick={() =>
                    router.push({
                      pathname: `/NFT-details`,
                      query: { auctionId: `${el.auctionId}` },
                    })
                  }
                >
                  <SliderCard key={i + 1} el={el} i={i} />
                </div>
              ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Slider;
