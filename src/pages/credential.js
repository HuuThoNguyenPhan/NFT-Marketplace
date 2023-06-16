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
            Xác thực sẽ lưu thông tin của bạn, tăng độ uy tín. Sau khi xác thực thành công tên của bạn được đính kèm tích xanh
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
