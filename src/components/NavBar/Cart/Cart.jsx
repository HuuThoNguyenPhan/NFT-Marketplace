import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
//INTERNAL IMPORT
import Style from "./Cart.module.css";
import images from "../../../assets/img";
const Cart = ({
  isOpen,
  fetchUserCart,
  deleteFromCart,
  cart,
  setCart,
  deleteAllCart,
  buyNFT,
}) => {
  useEffect(() => {
    fetchUserCart().then((data) => {
      setCart(data);
    });
  }, [isOpen]);
  const handelDeleteAll = () => {
    deleteAllCart().then(() => {
      fetchUserCart().then((data) => {
        setCart(data);
      });
    });
  };
  const handelDelete = (tokenId) => {
    deleteFromCart(tokenId).then(() => {
      fetchUserCart().then((data) => {
        alert("Đã xóa thành công");
        setCart(data);
      });
    });
  };

  const renderImage = (type,item) => {
    switch (type) {
      case "image":
        return (
          <Image
            src={item.image}
            alt="ảnh sản phẩm"
            width={60}
            height={60}
            className={Style.cart_box_img}
          />
        );
      case "video":
        return (
          <Image
            src={images.nft_video}
            alt="ảnh sản phẩm"
            width={60}
            height={60}
            className={Style.cart_box_img}
          />
        );
      default:
        return (
          <Image
            src={images.file}
            alt="ảnh sản phẩm"
            width={60}
            height={60}
            className={Style.cart_box_img}
          />
        );
    }
  };
  const payment = async () => {
    for (let i = 0; i < cart.length; i++) {
      const nft = {
        name: cart[i].name,
        tokenIds: [cart[i].tokenId],
        price: cart[i].price,
        tokenId: cart[i].tokenId,
      };
      if (i == cart.length - 1) {
        await buyNFT(nft, 1, false, true);
      } else {
        await buyNFT(nft, 1, true, false);
      }
    }
  };

  return (
    <div className={`${Style.cart} ${isOpen ? Style.open : ""}`}>
      <p>Giỏ hàng</p>
      <hr />
      {cart == undefined || cart.length == 0 ? (
        <div className={Style.cart_box_start}>Chưa có sản phẩm nào</div>
      ) : (
        <div>
          <div className={Style.cart_box_fearture}>
            <h3>{cart.length} sản phẩm</h3>
            <p onClick={handelDeleteAll}>Xóa tất cả</p>
          </div>
          {cart.map((item) => (
            <div className={Style.cart_box}>
              {renderImage(item.typeFile,item)}
              <div className={Style.cart_box_info}>
                <h4>{item.name}</h4>
                <p>
                  {item.author.slice(0, 6)}...{item.author.slice(-4)}
                </p>
                <small>{item.royalties}</small>
              </div>
              <span className={Style.cart_box_price}>{item.price} {item.price !== "Đã bán" && "ETH"}</span>
              <span
                className={Style.cart_box_detete}
                onClick={() => handelDelete(item.tokenId)}
              >
                <FiTrash2 size={20} />
              </span>
            </div>
          ))}
          <hr />
          <div className={Style.cart_box_fearture}>
            <h3>Tổng tiền</h3>
            <p>{cart.reduce((a, b) => a + (b.price !== "Đã bán" && b.price), 0)} ETH</p>
          </div>
        </div>
      )}

      {cart != undefined && cart.length != 0 ? (
        <button
          className={Style.btnBuy}
          onClick={() => {
            payment();
          }}
        >
          Thanh toán
        </button>
      ) : (
        <button className={Style.btnBuy_notActive}>Thanh toán</button>
      )}
    </div>
  );
};

export default Cart;
