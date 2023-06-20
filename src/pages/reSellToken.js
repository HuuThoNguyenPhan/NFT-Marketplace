import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
//INTERNAL IMPORT
import Style from "../styles/reSellToken.module.css";
import formStyle from "../components/AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex";
import images from "../assets/img";
//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const reSellToken = () => {
  const { createSale, fetchTokenURI, setError, setOpenError, changeCurrency } =
    useContext(NFTMarketplaceContext);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [limit, setLimit] = useState(1);
  const [typeFile, setTypeFile] = useState("");
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [tkIds, setTkIds] = useState([]);
  let [priceVND, setPriceVND] = useState("");
  const renderPreview = (typeFile, fileUrl) => {
    switch (typeFile) {
      case "image":
        return (
          <Image
            className={Style.image}
            src={fileUrl}
            alt="nft image"
            width={700}
            height={500}
            objectFit="contain"
          />
        );

      case "audio":
        return (
          <div className={Style.image_audio}>
            <Image
              src={images.creatorbackground10}
              alt="nft image"
              width={700}
              height={500}
              objectFit="cover"
            />
            <audio
              className={Style.audio}
              controls
              style={{ margin: "0 auto" }}
            >
              <source src={fileUrl} />
            </audio>
          </div>
        );

      case "video":
        return (
          <video
            width="100%"
            height="100%"
            controls
            style={{ margin: "0 auto" }}
          >
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
      default:
        return (
          <Image
            className={Style.image}
            src={images.file}
            alt="nft image"
            width={700}
            height={500}
            objectFit="contain"
          />
        );
    }
  };
  const fetchNFT = async (tokenURI) => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);

    setImage(
      "https://gateway.pinata.cloud/ipfs/" +
        data.products.image.slice(7, data.products.image.length)
    );
  };

  useEffect(() => {
    changeCurrency(1).then((e) => {
      setPriceVND(e);
    });
  }, []);

  const handlePrice = (e) => {
    const regex = /^$|^\d{0,11}(\.\d{0,4})?$/;
    if (regex.test(e.target.value) && e.target.value.toString().length < 16) {
      setPrice(e.target.value);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const tokenURI = router.query.data[0];

    if (!typeof router.query.tokenIds == "string") {
      setTkIds(router.query.tokenIds);
    } else {
      setTkIds([router.query.tokenIds]);
    }
    setName(router.query.data[3]);
    setCount(router.query.data[2]);
    setPrice(router.query.data[4]);
    setTypeFile(router.query.data[5]);
    fetchNFT(tokenURI);
  }, [router.isReady]);

  const handleNumber = (e, setState, check) => {
    const regex = /^$|^[1-9]\d*$/;
    if (e.target.value < count + 1 && regex.test(e.target.value)) {
      if (check) {
        if (e.target.value == "" || quantity + 1 > e.target.value) {
          setState(e.target.value);
        }
      } else {
        if (e.target.value == "" || limit < e.target.value + 1) {
          setState(e.target.value);
        }
      }
    }
  };

  const resell = async () => {
    try {
      console.log(price, quantity, limit);
      if (!price || !quantity || !limit) {
        setError("Vui lòng nhập đủ các trường");
        setOpenError(true);
        return;
      }
      else if(price == 0){
        setError("Nhập giá bán lại > 0");
        setOpenError(true);
        return;
      }
      const ids = [];

      if (tkIds.length > 1) {
        for (let i = 0; i < quantity; i++) {
          ids.push(parseInt(tkIds[0][i]));
        }
      } else {
        ids = [parseInt(tkIds[0])];
      }

      fetchTokenURI(ids).then(async (item) => {
        const time = name + new Date().getTime();
        let header = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };
        let body = JSON.stringify({
          time: name + time.toString(),
          ids: item,
          limit: limit,
        });
        let req = {
          url: "http://localhost:5000/api/v1/products/changeBreed",
          method: "POST",
          headers: header,
          data: body,
        };

        let response = await axios.request(req);
        if (response.status == 200) {
          await createSale("", price, quantity, true, ids);
          router.push("/author");
        }
      });
    } catch (error) {
      console.log("Lối trong khi tạo bán lại", error);
    }
  };

  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_box}>
        <h1>Bán lại sản phẩm của bạn, Đặt lại giá</h1>
        <div className={Style.reSellToken_box_image}>
          {image && renderPreview(typeFile, image)}
        </div>
        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Quantity">Số lượng ≤ {count}</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                value={quantity}
                onChange={(e) => handleNumber(e, setQuantity, false)}
                readOnly = {count  == 1 && true}
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
                placeholder=""
                value={limit}
                readOnly = {count  == 1 && true}
                onChange={(e) => handleNumber(e, setLimit, true)}
              />
            </div>
            <span>Giới hạn một lần mua ≤ số lượng</span>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Price">Giá bán lại</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                value={price}
                placeholder={"1 ETH ≈ " + priceVND || ""}
                onChange={(e) => handlePrice(e)}
              />
            </div>
          </div>
        </div>

        <Button
          classStyle={Style.button}
          btnName="Bán lại"
          handleClick={() => resell()}
        />
      </div>
    </div>
  );
};

export default reSellToken;
