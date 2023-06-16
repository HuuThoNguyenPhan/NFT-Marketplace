import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "../styles/reSellToken.module.css";
import formStyle from "../components/AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex";

//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const reSellToken = () => {
  const { createSale, fetchTokenURI, setError, setOpenError } = useContext(
    NFTMarketplaceContext
  );
  const [image, setImage] = useState("");
  const [price, setPrice] = useState('"');
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [limit, setLimit] = useState(1);
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [tkIds, setTkIds] = useState([]);

  const fetchNFT = async (tokenURI) => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);

    setImage(
      "https://gateway.pinata.cloud/ipfs/" +
        data.products.image.slice(7, data.products.image.length)
    );
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
    fetchNFT(tokenURI);
  }, [router.isReady]);

  const resell = async () => {
    try {
      if (quantity > count) {
        setError("Số lượng nhập vào lớn hơn trong kho");
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
      console.log(ids);
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
        console.log(item);
        if (response.status == 200) {
          await createSale("", price, quantity, true, ids);
          router.push("/author");
        }
        console.log(response);
      });
    } catch (error) {
      console.log("Error while resell", error);
    }
  };
  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_box}>
        <h1>Bán lại sản phẩm của bạn, Đặt lại giá</h1>
        <div className={Style.reSellToken_box_image}>
          {image && (
            <Image src={image} alt="resell nft" width={700} height={400} />
          )}
        </div>
        <div
          className={Style.form_resell}
        >
          <div>
            <label htmlFor="name">Số lượng (còn {count || 1})</label>
            <input
              type="number"
              min={1}
              value={quantity}
              className={formStyle.Form_box_input_userName}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="limit">Giới hạn mua</label>
            <input
              type="number"
              min={1}
              value={quantity}
              className={formStyle.Form_box_input_userName}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="name">Giá</label>
            <input
              type="number"
              min={1}
              value={price}
              className={formStyle.Form_box_input_userName}
              onChange={(e) => setPrice(e.target.value)}
            />
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
