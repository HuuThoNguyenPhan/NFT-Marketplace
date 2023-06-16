import React, { useState, useContext } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiFlag } from "react-icons/ti";

import Image from "next/image";
import { useRouter } from "next/router";

import Style from "./UploadProfile.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import images from "../../assets/img";
import { Button } from "../../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";
import { wrap } from "framer-motion";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const UploadProfile = () => {
  const { credential } = useContext(NFTMarketplaceContext);
  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [image, setImage] = useState(null);

  return (
    <div className={Style.upload}>
      <div className={Style.dropZone}>
        <DropZone
          title="Ảnh đại diện: JPG, PNG"
          heading="Kéo và thả tệp"
          subHeading="hoặc tải tệp lên từ thiết bị của bạn"
          name={name}
          website={website}
          description={description}
          country={country}
          setFileSize={setFileSize}
          setImage={setImage}
          fileSize={fileSize}
          image={image}
        />
      </div>

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Tên người dùng</label>
          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Ngọc Ý"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="Hãy miêu tả về bản thân ..."
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Lý do</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="Lý do của bạn ..."
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Country">Quốc gia</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <TiFlag />
              </div>
              <input type="text" onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="email">Email</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <MdOutlineAttachFile />
              </div>
              <input
                type="email"
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Xác thực"
            handleClick={async () =>
              credential(
                name,
                description,
                reason,
                contact,
                image,
                country
                // website,
                // royalties,
                // fileSize,
                // category,
                // properties
              )
            }
            classStyle={Style.upload_box_btn_style}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
