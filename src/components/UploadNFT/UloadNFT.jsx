import React, { useContext, useEffect, useState } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";

import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button, OptionTopic } from "../../components/componentsindex.js";
import { DropZone } from "../UploadNFT/uploadNFTIndex.js";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const UloadNFT = ({ createNFT }) => {
  let [priceVND, setPriceVND] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [option, setOption] = useState(0);
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [limit, setLimit] = useState(1);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { changeCurrency, fetchTopics } = useContext(NFTMarketplaceContext);
  const [openTopic, setOpenTopic] = useState(false);
  const [topics, setTopics] = useState([]);

  const handleNumber = (e, setState) => {
    setState(() => {
      e.target.value = e.target.value.replace(" ", "");
      return Number.isInteger(Number(e.target.value)) &&
        Number(e.target.value) >= 0
        ? e.target.value.replace(".", "")
        : 1;
    });
  };

  const handleText = (e, set, length, end) => {
    let text = e.target.value.replace(/\s+/g, " ");
    if (text.length < length) {
      set(text);
    } else {
      set(text.slice(0, end));
    }
  };
  useEffect(() => {
    changeCurrency(1).then((e) => {
      setPriceVND(e);
    });
  }, []);

  useEffect(() => {
    fetchTopics().then((e) => {
      e.sort((a, b) => a.topicName.localeCompare(b.topicName));
      e.forEach(function (obj) {
        obj.active = false;
      });
      setTopics(e);
      console.log(topics);
    });
  }, []);
  const handlePrice = (e) => {
    const regex = /^\d{0,15}(\.\d{1,})?$/;
    return regex.test(e.target.value);
  };
  const handelOpen = () => {
    setOpenTopic(true);
    document.querySelector("body").style.overflow = "hidden";
  };
  const setTopic = (topic) => {
    setTopics((prev) => {
      return prev.map((el) => {
        if (el.topicName === topic) {
          return {
            ...el,
            active: !el.active,
          };
        }
        return el;
      });
    });
  };

  return (
    <div className={Style.upload}>
      <DropZone
        title="JPG, PNG, WEBM"
        heading="Kéo và thả tệp"
        subHeading="hoặc tải tệp lên từ thiết bị của bạn"
        name={name}
        description={description}
        royalties={royalties}
        setFileSize={setFileSize}
        topics={topics}
        setImage={setImage}
        fileSize={fileSize}
        image={image}
        quantity={quantity}
      />

      {openTopic && (
        <OptionTopic
          setOpen={setOpenTopic}
          topics={topics}
          setTopics={setTopic}
        />
      )}

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="nft">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="Ví dụ: My NFT"
            value={name}
            className={formStyle.Form_box_input_userName}
            onChange={(e) => handleText(e, setName, 20, 21)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            value={description}
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="Hãy ghi mô tả sản phẩm ..."
            onChange={(e) => handleText(e, setDescription, 2000, 2001)}
          ></textarea>
          <p>
            Mô tả sẽ được đưa vào trang chi tiết của sản phẩm, bên dưới hình ảnh
            của sản phẩm đó.
          </p>
        </div>

        <div className={formStyle.Form_box_input_social}>
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
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => handleNumber(e, setQuantity)}
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
                type="number"
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
            <label htmlFor="Royalties">Tiền bản quyền</label>
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
            <label htmlFor="Quantity">Tùy chọn đăng</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <select
                className={formStyle.Form_box_input_box_select}
                value={option}
                onChange={(e) => {
                  setOption(e.target.value);
                }}
              >
                <option value={0}>Mặc định</option>
                <option value={1}>Đưa về kho</option>
              </select>
            </div>
          </div>
          <div
            className={formStyle.Form_box_input}
            onClick={() => handelOpen()}
          >
            <label htmlFor="Quantity">Chủ đề</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                placeholder="Nhấp để chọn"
                type="text"
                value={topics
                  .filter((item) => item.active === true)
                  .map((item) => item.topicName)}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Tạo mới"
            handleClick={async () =>
              createNFT(
                name,
                price,
                image,
                description,
                quantity,
                limit,
                option,
                royalties,
                topics
                  .filter((item) => item.active === true)
                  .map((item) => item.topicName)
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
