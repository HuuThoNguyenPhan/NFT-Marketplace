import React from "react";

import Style from "../styles/upload-nft.module.css";
import { UploadProfile } from "../components/componentsindex";

const uploadNFT = () => {
  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Xác thực người dùng</h1>
          <p>
            You can set preferred display name, create your profile URL and
            manage other personal settings.
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Image, Video, Audio, or 3D Model</h2>
          <p>
            Các loại tệp hỗ trợ: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Kích thước tối đa: 25 MB
          </p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadProfile />
        </div>
      </div>
    </div>
  );
};

export default uploadNFT;
