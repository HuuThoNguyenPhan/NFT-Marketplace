import React, { useState, useEffect, useContext, useRef } from "react";
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
import { FiX, FiChevronDown } from "react-icons/fi";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";

//INTERNAL IMPORT
import Style from "./NFTDescription.module.css";
import images from "../../../assets/img";
import { Button } from "../../../components/componentsindex.js";
import { NFTTabs } from "../NFTDetailsIndex";

//IMPORT SMART CONTRACT
import { NFTMarketplaceContext } from "../../../../Context/NFTMarketplaceContext";

const NFTDescription = ({ nft, lastBid, lastBidder }) => {
  const {
    buyNFT,
    currentAccount,
    fetchOwner,
    changeCurrency,
    cancleAuction,
    joinAuction,
    fetchContentReports,
    sendReport,
  } = useContext(NFTMarketplaceContext);

  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [ownerArray, setOwnerArray] = useState([images.user1]);
  const [changePrice, setChangePrice] = useState();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const historyArray = ["gà"];
  const [bid, setBid] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const sellerRef = useRef();
  const authorRef = useRef();
  const [reports, setReports] = useState([]);
  const [reason, setReason] = useState("");
  const [openListReport, setOpenListReport] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const handleOpenReport = () => {
    setOpenReport(true);
    setNFTMenu(false);
  };

  const handleCloseReport = () => {
    setReason("");
    document.getElementsByClassName(".type_Reason").value = "";
    setOpenReport(false);
    setOpenListReport(false);
  };

  const handleOpenListReport = () => {
    fetchContentReports().then((res) => {
      setOpenListReport(!openListReport);
      setReports(res)
    });
  };

  function handleNavigation() {
    Router.push({ pathname: "/author", query: { seller: `${nft.seller}` } });
    window.print = function () {};
  }
  useEffect(() => {
    if (nft.endTime) {
      setTimeRemaining(
        new Date(nft.endTime.toNumber()).getTime() - new Date().getTime()
      );
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1000);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [nft.endTime]);

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
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
  };

  useEffect(() => {
    convertImage(nft.seller, sellerRef);
    convertImage(nft.author, authorRef);
  }, [nft.seller, nft.author]);

  useEffect(() => {
    changeCurrency(lastBid || nft.price).then((e) => {
      setChangePrice(e);
    });
    fetchOwner(nft.tokenIds).then((owners) => {
      setOwnerArray(owners);
    });
  }, [owner, changePrice]);

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
                <a onClick={handleOpenReport}>
                  <MdReportProblem /> Tố cáo
                </a>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${Style.Report_table}  ${
            openReport && Style.Report_table_show
          }`}
        >
          <div className={Style.Report_table_header}>
            <h3>Tố cáo sản phẩm</h3>
            <FiX
              className={Style.close}
              onClick={() => handleCloseReport()}
              size={23}
            />
          </div>
          <label>
            Tôi nghỉ sản phẩm này ...<br></br>
            <div style={{ position: "relative" }}>
              <input
                className={Style.type_Reason}
                placeholder="Chọn lý do"
                readOnly
                value={reason == "" ? "" : reason.description}
                onClick={handleOpenListReport}
              />
              <FiChevronDown
                size={22}
                className={`${Style.icon_down}  ${
                  openListReport && Style.icon_down_show
                }`}
              />
              {openListReport == true && (
                <div className={Style.reasons_Report}>
                  {reports.map((report) => (
                    <div
                      className={Style.reasons_Report_item}
                      onClick={() => setReason(report)}
                    >
                      {report.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
          {reason == "" ? (
            <button className={Style.btn_Report_fade}>Tố cáo</button>
          ) : (
            <button
              className={Style.btn_Report}
              onClick={() => {
                sendReport(reason.option, nft.genealogy, handleCloseReport());
              }}
            >
              Tố cáo
            </button>
          )}
        </div>

        {openReport && <div className={Style.overlay}></div>}
        <div className={Style.NFTDescription_box_profile}>
          <h1>
            {nft.name} #{nft.tokenId}
          </h1>
          <div className={Style.NFTDescription_box_profile_box}>
            {nft.seller != "0x0000000000000000000000000000000000000000" && (
              <div className={Style.NFTDescription_box_profile_box_left}>
                <div
                  ref={sellerRef}
                  style={{ cursor: "pointer" }}
                  onClick={handleNavigation}
                ></div>
                <div className={Style.NFTDescription_box_profile_box_left_info}>
                  <small>Người đăng</small> <br />
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={handleNavigation}
                  >
                    {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}{" "}
                    <MdVerified />
                  </span>
                </div>
              </div>
            )}

            <div className={Style.NFTDescription_box_profile_box_right}>
              <div
                ref={authorRef}
                style={{ cursor: "pointer" }}
                onClick={handleNavigation}
              ></div>

              <div className={Style.NFTDescription_box_profile_box_right_info}>
                <small>Tác giả</small> <br />
                <span>
                  {nft.author.slice(0, 6)}...{nft.author.slice(-4)}{" "}
                  <MdVerified />
                </span>
              </div>
            </div>
          </div>

          <div className={Style.NFTDescription_box_profile_biding}>
            <p>
              <MdTimer />{" "}
              <span>
                {nft.auctionId != undefined
                  ? "Kết thúc trong vòng:"
                  : "Đăng ngày:"}
              </span>
            </p>

            {nft.auctionId != undefined ? (
              <div
                className={Style.NFTDescription_box_profile_biding_box_timer}
              >
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <p>{days}</p>
                  <span>Ngày</span>
                </div>
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <p>{hours}</p>
                  <span>Giờ</span>
                </div>
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <p>{minutes}</p>
                  <span>Phút</span>
                </div>
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <p>{seconds}</p>
                  <span>Giây</span>
                </div>
              </div>
            ) : (
              <div
                className={Style.NFTDescription_box_profile_biding_box_timer}
              >
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <span>Ngày</span>
                  <p>{nft.createAt.split("/")[1]}</p>
                </div>
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <span>Thàng</span>
                  <p>{nft.createAt.split("/")[0]}</p>
                </div>
                <div
                  className={
                    Style.NFTDescription_box_profile_biding_box_timer_item
                  }
                >
                  <span>Năm</span>
                  <p>{nft.createAt.split("/")[2]}</p>
                </div>
              </div>
            )}

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Giá hiện tại || Số lượng: {nft.count || 1}</small>
                <p>{lastBid || nft.price} ETH</p>
                <p>(≈ {changePrice})</p>
                {nft.auctionId && lastBidder && (
                  <>
                    <p title={lastBidder}>Người tham gia cuối cùng</p>
                    <p title={lastBidder}>
                      {lastBidder?.slice(0, 6) ?? "Chưa có"}...
                      {lastBidder?.slice(-4) ?? "Chưa có"}
                    </p>
                  </>
                )}
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
                        query: nft,
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
                    {nft.only == "false" && (
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
                      </div>
                    )}
                    <Button
                      icon=<FaWallet />
                      btnName="Mua"
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
                    handleClick={() =>
                      cancleAuction(nft.auctionId, true, nft.tokenId, nft.name)
                    }
                    classStyle={Style.button}
                  />

                  {nft.lastBidder !=
                    "0x0000000000000000000000000000000000000000" && (
                    <Button
                      icon=<FaWallet />
                      btnName="Kết thúc"
                      handleClick={() =>
                        cancleAuction(
                          nft.auctionId,
                          false,
                          nft.tokenId,
                          nft.name
                        )
                      }
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
                      Giá trị nhập thấp nhất{" "}
                      {parseFloat((lastBid || nft.price * 10) / 100) +
                        parseFloat(lastBid || nft.price)}{" "}
                      ETH
                    </span>

                    <Button
                      icon=<FaWallet />
                      btnName="Đấu giá"
                      handleClick={() => joinAuction(nft.auctionId, bid)}
                      classStyle={Style.button}
                    />
                  </div>
                </div>
              ))
            )}

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={() => openOwmer()}>Người sở hữu</button>
              <button onClick={(e) => openTabs(e)}>Lịch sử giá</button>
            </div>
            {/* {owner && ownerArray && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={ownerArray} />
              </div>
            )}

            {history && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTTabs dataTab={historyArray} />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDescription;
