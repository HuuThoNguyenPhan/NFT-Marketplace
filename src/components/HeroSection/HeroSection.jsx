import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Style from "./HeroSection.module.css";
import { Button } from "../componentsindex";
import images from "../../assets/img";

const HeroSection = () => {
  const router = useRouter();
  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h1>Khám phá, sưu tập và bán sản phẩm NFT 🖼️</h1>
          <p>
            Khám phá những NTF nổi bật nhất trong mọi chủ đề của cuộc sống. Sáng
            tạo NTF của bạn và bán chúng
          </p>
          <Button
            btnName="Khám phá"
            handleClick={() => router.push("/searchPage")}
          />
        </div>
        <div className={Style.heroSection_box_right}>
          <Image
            src={images.hero}
            alt="Hero section"
            width={600}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
