import React, { useContext, useEffect, useState } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";

import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import images from "../../assets/img";
import { Button } from "../../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const UloadNFT = ({ uploadToIPFS, createNFT }) => {
  let [priceVND,setPriceVND] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState(0);
  const [limit, setLimit] = useState(1);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { changeCurrency } = useContext(NFTMarketplaceContext);
  const router = useRouter();

  const categoryArry = [
    {
      image: images.nft_image_1,
      category: "Sports",
    },
    {
      image: images.nft_image_2,
      category: "Arts",
    },
    {
      image: images.nft_image_3,
      category: "Music",
    },
    {
      image: images.nft_image_1,
      category: "Digital",
    },
    {
      image: images.nft_image_2,
      category: "Time",
    },
    {
      image: images.nft_image_3,
      category: "Photography",
    },
  ];

  const handleNumber = (e, setState) => {
    setState(() => {
      e.target.value = e.target.value.replace(" ", "");
      return Number.isInteger(Number(e.target.value)) &&
        Number(e.target.value) >= 0
        ? e.target.value.replace(".", "")
        : 1;
    });
  };

  useEffect(() => {
    changeCurrency(1).then((e) => {
      setPriceVND(e)
    });  
  },[])

  return (
    <div className={Style.upload}>
      <DropZone
        title="JPG, PNG, WEBM"
        heading="Kéo và thả tệp"
        subHeading="hoặc tải tệp lên từ thiết bị của bạn"
        name={name}
        website={website}
        description={description}
        royalties={royalties}
        setFileSize={setFileSize}
        category={category}
        setImage={setImage}
        fileSize={fileSize}
        image={image}
      />

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="nft">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="shoaib bhai"
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
            placeholder="Hãy miêu tả sản phẩm một ít ..."
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p>
            Mô tả sẽ được đưa vào trang chi tiết của sản phẩm, bên dưới hình ảnh
            của sản phẩm đó.
          </p>
        </div>


        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Royalties">Royalties</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <FaPercent />
              </div>
              <input
                type="text"
                placeholder="20%"
                onChange={(e) => setRoyalties(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="size">Kích thước</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <MdOutlineAttachFile />
              </div>
              <input
                type="text"
                placeholder={fileSize + " MB"}
                onChange={(e) => setFileSize(e.target.value)}
                readOnly
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Propertie">Giới hạn một lần mua</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                value={limit}
                onChange={(e) =>
                  setLimit(() => {
                    if (e.target.value > quantity) {
                      return quantity;
                    } else {
                      return e.target.value;
                    }
                  })
                }
              />
            </div>
          </div>

          <div className={formStyle.Form_box_input}>
            <label htmlFor="Price">Giá</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="number"
                placeholder={"1 ETH ≈ " + priceVND || ""}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className={formStyle.Form_box_input}>
            <label htmlFor="Quantity">Số lượng</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                value={quantity}
                min={1}
                onChange={(e) => handleNumber(e, setQuantity)}
              />
            </div>
          </div>
        </div>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Tạo NFT"
            handleClick={async () =>
              createNFT(
                name,
                price,
                image,
                description,
                router,
                quantity,
                limit
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

export default UloadNFT;
