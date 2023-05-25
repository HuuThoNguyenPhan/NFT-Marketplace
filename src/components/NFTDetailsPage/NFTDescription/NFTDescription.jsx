import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import jazzicon from "@metamask/jazzicon";
import {
  MdVerified,
  MdCloudUpload,
  MdTimer,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import { RiAuctionLine } from "react-icons/ri";

//INTERNAL IMPORT
import Style from "./NFTDescription.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsindex.js";
import { NFTTabs } from "../NFTDetailsIndex";

//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../../../../Context/NFTMarketplaceContext";

const NFTDescription = ({ nft }) => {
  const {
    buyNFT,
    currentAccount,
    fecthOwner,
    changeCurrency,
    cancleAuction,
    joinAuction,
  } = useContext(NFTMarketplaceContext);

  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [ownerArray, setOwnerArray] = useState([images.user1]);
  const [price, setPrice] = useState(nft.price);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const historyArray = ["gà"];
  const [bid, setBid] = useState(1);
  const sellerRef = useRef();
  const authorRef = useRef();
  function handleNavigation() {
    Router.push({ pathname: "/author", query: { seller: `${nft.seller}` } });
    window.print = function () {};
  }

  const openSocial = () => {
    if (!social) {
      setSocial(true);
      setNFTMenu(false);
    } else {
      setSocial(false);
    }
  };

  const openNFTMenu = () => {
    if (!NFTMenu) {
      setNFTMenu(true);
      setSocial(false);
    } else {
      setNFTMenu(false);
    }
  };

  const openTabs = (e) => {
    const btnText = e.target.innerText;

    if (btnText == "Bid History") {
      setHistory(true);
      setProvanance(false);
      setOwner(false);
    } else if (btnText == "Provanance") {
      setHistory(false);
      setProvanance(true);
      setOwner(false);
    }
  };

  const openOwmer = () => {
    if (!owner) {
      setOwner(true);
      setHistory(false);
      setProvanance(false);
    } else {
      setOwner(false);
      setHistory(true);
    }
  };
  const convertImage = (address, ref) => {
    const { current: element } = ref;
    if (element && address) {
      const seed = parseInt(address.slice(2, 10), 16);
      const icon = jazzicon(45, seed); 
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }

  useEffect(() => {
    convertImage(nft.seller, sellerRef);
    convertImage(nft.author, authorRef);
  }, [nft.seller,nft.author]);

  useEffect(() => {
    changeCurrency(nft.price).then((e) => {
      setPrice(e);
    });
    fecthOwner(nft.tokenIds).then((owners) => {
      setOwnerArray(owners);
    });
  }, [owner, price]);

  return (
    <div className={Style.NFTDescription}>
      <div className={Style.NFTDescription_box}>
        <div className={Style.NFTDescription_box_share}>
          <p>{nft.typeFile}</p>
          <div className={Style.NFTDescription_box_share_box}>
            <MdCloudUpload
              className={Style.NFTDescription_box_share_box_icon}
              onClick={() => openSocial()}
            />

            {social && (
              <div className={Style.NFTDescription_box_share_box_social}>
                <a href="#">
                  <TiSocialFacebook /> Facebook
                </a>
                <a href="#">
                  <TiSocialInstagram /> Instragram
                </a>
                <a href="#">
                  <TiSocialLinkedin /> LinkedIn
                </a>
                <a href="#">
                  <TiSocialTwitter /> Twitter
                </a>
                <a href="#">
                  <TiSocialYoutube /> YouTube
                </a>
              </div>
            )}

            <BsThreeDots
              className={Style.NFTDescription_box_share_box_icon}
              onClick={() => openNFTMenu()}
            />

            {NFTMenu && (
              <div className={Style.NFTDescription_box_share_box_social}>
                <a href="#">
                  <BiDollar /> Change price
                </a>
                <a href="#">
                  <BiTransferAlt /> Transfer
                </a>
                <a href="#">
                  <MdReportProblem /> Report abouse
                </a>
                <a href="#">
                  <MdOutlineDeleteSweep /> Delete item
                </a>
              </div>
            )}
          </div>
        </div>

        <div className={Style.NFTDescription_box_profile}>
          <h1>{nft.name} #{nft.tokenId}</h1>
          <div className={Style.NFTDescription_box_profile_box}>
            <div className={Style.NFTDescription_box_profile_box_left}>
            <div ref={sellerRef} style={{cursor: "pointer"}} onClick={handleNavigation}></div>
              <div className={Style.NFTDescription_box_profile_box_left_info}>
                <small>Người tạo</small> <br />
                <span style={{cursor: "pointer"}} onClick={handleNavigation}>
                  {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)} <MdVerified />
                </span>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_box_right}>
            <div ref={authorRef} style={{cursor: "pointer"}} onClick={handleNavigation}></div>

              <div className={Style.NFTDescription_box_profile_box_right_info}>
                <small>Người sở hữu</small> <br />
                <span>
                {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)} <MdVerified />
                </span>
              </div>
            </div>
          </div>

          <div className={Style.NFTDescription_box_profile_biding}>
            <p>
              <MdTimer /> <span>Kết thúc trong vòng:</span>
            </p>

            <div className={Style.NFTDescription_box_profile_biding_box_timer}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>2</p>
                <span>Ngày</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>22</p>
                <span>Giờ</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>45</p>
                <span>Phút</span>
              </div>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <p>12</p>
                <span>Giây</span>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>
                  Giá hiện tại || Số lượng: {nft.count || 1} sản phẩm
                </small>
                <p>{nft.price} ETH</p>
                <p>(≈ {price})</p>
              </div>
            </div>

            {nft.auctionId == undefined ? (
              currentAccount == nft.seller.toLowerCase() ? (
                <p>Bạn không thể mua sản phẩm NFT của chính mình</p>
              ) : currentAccount == nft.owner.toLowerCase() ? (
                <div
                  className={Style.NFTDescription_box_profile_biding_box_button}
                >
                  <Button
                    icon=<FaWallet />
                    btnName="Bán lại"
                    handleClick={() =>
                      router.push({
                        pathname: "/reSellToken",
                        query: {
                          data: [
                            nft.tokenURI,
                            nft.price,
                            nft.count,
                            nft.name,
                            nft.price,
                          ],
                          tokenIds: nft.tokenIds ? nft.tokenIds : nft.tokenId,
                        },
                      })
                    }
                    classStyle={Style.button}
                  />
                  <Button
                    icon=<FaWallet />
                    btnName="Tạo phiên đấu giá"
                    handleClick={() =>
                      router.push({
                        pathname: "/createAuction",
                        query: {
                          data: [
                            nft.tokenId,
                            // nft.image,
                            // nft.price,
                            // nft.count,
                            // nft.name,
                            // nft.price,
                          ],
                          tokenIds: nft.tokenIds ? nft.tokenIds : nft.tokenId,
                        },
                      })
                    }
                    classStyle={Style.button}
                  />
                </div>
              ) : (
                <div
                  className={Style.NFTDescription_box_profile_biding_box_button}
                >
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                    />
                    <span>
                      {nft.quantity < nft.limit
                        ? "[Số lượng mua <= " + nft.quantity + "]"
                        : "[Số lượng mua <= " + nft.limit + "]"}
                    </span>
                    <Button
                      icon=<FaWallet />
                      btnName="Mua ngay"
                      handleClick={() => buyNFT(nft, quantity)}
                      classStyle={Style.button}
                    />
                  </div>
                </div>
              )
            ) : (
              nft.completed == false &&
              (currentAccount == nft.seller.toLowerCase() ? (
                <div
                  className={Style.NFTDescription_box_profile_biding_box_button}
                >
                  <Button
                    icon=<FaWallet />
                    btnName="Hủy phiên"
                    handleClick={() => cancleAuction(nft.auctionId, true)}
                    classStyle={Style.button}
                  />

                  {nft.lastBidder !=
                    "0x0000000000000000000000000000000000000000" && (
                    <Button
                      icon=<FaWallet />
                      btnName="Kết thúc"
                      handleClick={() => cancleAuction(nft.auctionId, false)}
                      classStyle={Style.button}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={Style.NFTDescription_box_profile_biding_box_button}
                >
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={bid}
                      onChange={(e) => {
                        setBid(e.target.value);
                      }}
                    />
                    <span>
                      Giá trị nhập thấp nhất
                      {parseFloat((nft.price * 10) / 100) +
                        parseFloat(nft.price)}{" "}
                      ETH
                    </span>
                    {currentAccount != nft.lastBidder.toLowerCase() && (
                      <Button
                        icon=<FaWallet />
                        btnName="Đấu giá"
                        handleClick={() => joinAuction(nft.auctionId, bid)}
                        classStyle={Style.button}
                      />
                    )}
                  </div>
                </div>
              ))
            )}

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={() => openOwmer()}>Người sở hữu</button>
              <button onClick={(e) => openTabs(e)}>Lịch sử giá</button>
            </div>
            {owner && ownerArray && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={ownerArray} />
              </div>
            )}

            {history && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={historyArray} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDescription;
