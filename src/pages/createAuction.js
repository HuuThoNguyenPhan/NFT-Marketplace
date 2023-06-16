import React, { useContext, useEffect, useState } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { useRouter } from "next/router";
import Style from "../styles/upload-nft.module.css";
import formStyle from "../components/AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import Image from "next/image";

const createAuction = () => {
  const { changeCurrency, createAuction } = useContext(NFTMarketplaceContext);
  let [priceVND, setPriceVND] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [limit, setLimit] = useState(1);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [tokenId, setTokenId] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [initialPrice, setInitialPrice] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    setTokenId(router.query.tokenId);
    console.log(router.query);
    changeCurrency(1).then((e) => {
      setPriceVND(e);
    });
  }, [router.isReady]);

  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_form}>
          <div className={Style.upload}>
            <div className={Style.upload_box}>
              <h1 style={{ fontSize: 49, fontWeight: 700}}>
                Tạo phiên đấu giá sản phẩm NFT
              </h1>
              <div className={Style.reSellToken_box_image}>
                {router.query.image && (
                  <Image
                    src={router.query.image}
                    alt="Tạo đấu giá nft"
                    width={700}
                    height={400}
                    objectFit="contain"
                  />
                )}
              </div>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="nft">Tên sản phẩm</label>
                <input
                  type="text"
                  value={router.query.name}
                  readOnly
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
                  value={router.query.description}
                  placeholder="Hãy miêu tả sản phẩm một ít ..."
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <p>
                  Mô tả sẽ được đưa vào trang chi tiết của sản phẩm, bên dưới
                  hình ảnh của sản phẩm đó.
                </p>
              </div>

              <div className={formStyle.Form_box_input_social}>
                <div className={formStyle.Form_box_input}>
                  <label htmlFor="Quantity">Số lượng</label>
                  <div className={formStyle.Form_box_input_box}>
                    <div className={formStyle.Form_box_input_box_icon}>
                      <AiTwotonePropertySafety />
                    </div>
                    <input
                      readOnly
                      placeholder="1"
                      type="text"
                      value={quantity}
                      min={1}
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
                      value={router.query.size + " MB"}
                      readOnly
                    />
                  </div>
                </div>
                <div className={formStyle.Form_box_input}>
                  <label htmlFor="Price">Giá khởi điểm</label>
                  <div className={formStyle.Form_box_input_box}>
                    <div className={formStyle.Form_box_input_box_icon}>
                      <AiTwotonePropertySafety />
                    </div>
                    <input
                      type="number"
                      placeholder={"1 ETH ≈ " + priceVND || ""}
                      onChange={(e) => {
                        setInitialPrice(e.target.value);
                        console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={formStyle.Form_box_input}>
                  <label htmlFor="size">Thời gian bắt đầu</label>
                  <div className={formStyle.Form_box_input_box}>
                    <div className={formStyle.Form_box_input_box_icon}>
                      <MdOutlineAttachFile />
                    </div>
                    <input
                      type="datetime-local"
                      onChange={(e) => {
                        setstartTime(e.target.value);
                        console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={formStyle.Form_box_input}>
                  <label htmlFor="size">Thời gian kết thúc</label>
                  <div className={formStyle.Form_box_input_box}>
                    <div className={formStyle.Form_box_input_box_icon}>
                      <MdOutlineAttachFile />
                    </div>
                    <input
                      type="datetime-local"
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        console.log(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={Style.upload_box_btn}>
                <Button
                  btnName="Tạo đấu giá"
                  handleClick={() =>
                    createAuction(tokenId, initialPrice, startTime, endTime)
                  }
                  classStyle={Style.upload_box_btn_style}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default createAuction;
