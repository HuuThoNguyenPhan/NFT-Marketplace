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
  const [bid, setBid] = useState(nft.price);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const sellerRef = useRef();
  const authorRef = useRef();
  const [reports, setReports] = useState([]);
  const [reason, setReason] = useState("");
  const [openListReport, setOpenListReport] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  let days = "";
  let hours = "";
  let minutes = "";
  let seconds = "";
  let months = "";
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
      setReports(res);
    });
  };

  function handleNavigation() {
    Router.push({ pathname: "/author", query: { seller: `${nft.seller}` } });
    window.print = function () {};
  }
  useEffect(() => {
    if (nft.endTime) {
      if (new Date(nft.endTime.toNumber()).getTime() > new Date().getTime()) {
        setTimeRemaining(
          new Date(nft.endTime.toNumber()).getTime() - new Date().getTime()
        );
      } else if (
        new Date(nft.startTime.toNumber()).getTime() > new Date().getTime()
      ) {
        setTimeRemaining(new Date(nft.startTime.toNumber()));
      }

      const intervalId = setInterval(() => {
        if (
          new Date(nft.startTime.toNumber()).getTime() <= new Date().getTime()
        ) {
          setTimeRemaining((prevTimeRemaining) =>
            prevTimeRemaining - 1000 <= 0 ? 0 : prevTimeRemaining - 1000
          );
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [nft.endTime, timeRemaining]);

  if (
    nft.auctionId &&
    new Date(nft.startTime.toNumber()).getTime() > new Date().getTime()
  ) {
    days = new Date(nft.startTime.toNumber()).getDate();
    months = new Date(nft.startTime.toNumber()).getMonth() + 1;
    hours = new Date(nft.startTime.toNumber()).getHours();
    minutes = new Date(nft.startTime.toNumber()).getMinutes();
  } else {
    days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  }

  const renderCountdown = () => {
    if (nft.auctionId != undefined) {
      if (new Date(nft.startTime.toNumber()).getTime() < new Date().getTime()) {
        return (
          <div className={Style.NFTDescription_box_profile_biding_box_timer}>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Ngày</span>
              <p>{days}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Giờ</span>
              <p>{hours}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Phút</span>
              <p>{minutes}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Giây</span>
              <p>{seconds}</p>
            </div>
          </div>
        );
      } else if (
        new Date(nft.startTime.toNumber()).getTime() > new Date().getTime()
      ) {
        return (
          <div className={Style.NFTDescription_box_profile_biding_box_timer}>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Ngày</span>
              <p>{days}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>tháng</span>
              <p>{months}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Giờ</span>
              <p>{hours}</p>
            </div>
            <div
              className={Style.NFTDescription_box_profile_biding_box_timer_item}
            >
              <span>Phút</span>
              <p>{minutes}</p>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className={Style.NFTDescription_box_profile_biding_box_timer}>
          <div
            className={Style.NFTDescription_box_profile_biding_box_timer_item}
          >
            <span>Ngày</span>
            <p>{nft.createAt.split("/")[1]}</p>
          </div>
          <div
            className={Style.NFTDescription_box_profile_biding_box_timer_item}
          >
            <span>Tháng</span>
            <p>{nft.createAt.split("/")[0]}</p>
          </div>
          <div
            className={Style.NFTDescription_box_profile_biding_box_timer_item}
          >
            <span>Năm</span>
            <p>{nft.createAt.split("/")[2]}</p>
          </div>
        </div>
      );
    }
  };
  const openSocial = () => {
    if (!social) {
      setSocial(true);
      setNFTMenu(false);
    } else {
      setSocial(false);
    }
  };

  const calBid = (val) => {
    return parseFloat((val * 10) / 100) + parseFloat(val);
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

  const handlePrice = (e) => {
    const regex = /^$|^\d{0,11}(\.\d{0,4})?$/;
    if (regex.test(e.target.value) && e.target.value.toString().length < 16) {
      setBid(e.target.value);
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

  const handleLimit = (e) => {
    const regex = /^$|^[1-9]\d*$/;
    const compare = nft.quantity < nft.limit ? nft.quantity : nft.limit;
    if (regex.test(e.target.value) && e.target.value < compare + 1) {
      setQuantity(e.target.value);
    }
  };
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

            <MdReportProblem
              className={Style.NFTDescription_box_share_box_icon}
              onClick={handleOpenReport}
            />
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
                    User_{nft.seller.slice(-4)}
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
                  user{nft.author.slice(-4)}
                  <MdVerified />
                </span>
              </div>
            </div>
          </div>

          <div className={Style.NFTDescription_box_profile_biding}>
            <p>
              <MdTimer />{" "}
              {nft.startTime > new Date().getTime() ? (
                <span>
                  {nft.auctionId != undefined ? "Bắt đầu lúc:" : "Đăng ngày:"}
                </span>
              ) : (
                <span>
                  {nft.auctionId != undefined
                    ? "Kết thúc trong vòng:"
                    : "Đăng ngày:"}
                </span>
              )}
            </p>
            {renderCountdown()}
            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Giá hiện tại || Số lượng: {nft.count || 1}</small>
                <p>{lastBid || nft.price} ETH</p>
                <p>≈ {changePrice}</p>
                {nft.auctionId != undefined && lastBidder != "0" && (
                  <>
                    <p title={lastBidder}>Người tham gia cuối cùng</p>
                    <p title={lastBidder}>
                      
                      {"User_" + lastBidder?.slice(-4) ?? "Chưa có"}
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
                            nft.typeFile,
                            nft.image,
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
                    {(nft.only == "false" || nft.limit != 1) && (
                      <div>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleLimit(e)}
                        />
                        <span>
                          {nft.quantity < nft.limit
                            ? "[Số lượng mua ≤ " + nft.quantity + "]"
                            : "[Số lượng mua ≤ " + nft.limit + "]"}
                        </span>
                      </div>
                    )}
                    <Button
                      icon=<FaWallet />
                      btnName="Mua"
                      handleClick={() => {
                        buyNFT(nft, quantity);
                      }}
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
                new Date().getTime() > nft.startTime.toNumber() &&
                new Date().getTime() <= nft.endTime.toNumber() && (
                  <div
                    className={
                      Style.NFTDescription_box_profile_biding_box_button
                    }
                  >
                    <div>
                      <input
                        type="text"
                        value={bid||nft.price}
                        onChange={(e) => {
                          handlePrice(e);
                        }}
                      />
                      <span>
                        Giá trị nhập thấp nhất {calBid(lastBid || nft.price)}{" "}
                        ETH
                      </span>

                      <Button
                        icon=<FaWallet />
                        btnName="Đấu giá"
                        handleClick={() => joinAuction(nft.auctionId, bid, calBid(lastBid || nft.price))}
                        classStyle={Style.button}
                      />
                    </div>
                  </div>
                )
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
