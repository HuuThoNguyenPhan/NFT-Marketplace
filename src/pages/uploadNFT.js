import React, { useEffect, useState, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/upload-nft.module.css";
import { UploadNFT } from "../components/UploadNFT/uploadNFTIndex";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

//SMART CONTRACT IMPORT

const uploadNFT = () => {
  const { uploadToIPFS, createNFT } = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Tạo sản phẩm NFT</h1>
          <p>
            Bạn có thể đặt tên hiển thị ưa thích, tạo URL hồ sơ của mình và tùy chỉnh các thông tin sản phẩm.
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Ảnh, Video, Tệp âm thanh, hoặc 3D </h2>
          <p>
            Các loại tệp hỗ trợ: JPG, PNG, GIF, SVG, MP4, MP3, PDF, WORD, EXCEL, ZIP, RAR, PPT. Kích thước tối đa: 25 MB
          </p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadNFT createNFT={createNFT} />
        </div>
      </div>
    </div>
  );
};

export default uploadNFT;
