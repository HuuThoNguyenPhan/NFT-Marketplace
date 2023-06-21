import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import { DiJqueryLogo } from "react-icons/di";
import { BsSearch } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";

import { useRouter } from "next/router";

import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Profile, SideBar, Cart } from "./index";
import { Button, Error } from "../componentsindex";
import images from "../../assets/img";
import jazzicon from "@metamask/jazzicon";
import { FaShoppingCart } from "react-icons/fa";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openCart, setopenCart] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const router = useRouter();

  const avatarRef = useRef();

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "Trang") {
      setDiscover(true);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    } else if (btnText == "Trợ giúp") {
      setDiscover(false);
      setHelp(true);
      setNotification(false);
      setProfile(false);
    } else {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
  };

  const openNotification = () => {
    if (!notification) {
      document.querySelector("body").style.overflow = "hidden";
      setNotification(true);
      setDiscover(false);
      setHelp(false);
      setProfile(false);
    } else {
      setNotification(false);
      document.querySelector("body").style.overflow = "";
    }
  };

  const openProfile = () => {
    console.log(profile);
    if (!profile) {
      setProfile(true);
      setHelp(false);
      setDiscover(false);
      setNotification(false);
    } else {
      setProfile(false);
    }
  };

  const openSideBar = () => {
    if (!openSideMenu) {
      setOpenSideMenu(true);
    } else {
      setOpenSideMenu(false);
    }
  };

  const handleToggle = () => {
    setopenCart(true);
    setProfile(false);
  };

  useEffect(() => {
    const handleClick = (event) => {
      const navbar = document.querySelector(".NavBar_navbar__tQ7C9");
      const discover = document.querySelector(
        ".NavBar_navbar_container_right_discover_box__APtSP"
      );
      const listhelp = document.querySelector(
        ".NavBar_navbar_container_right_help_box__fZWpP"
      );
      const page = document.querySelector(
        ".NavBar_navbar_container_right_discover__tUkZI"
      );
      const help = document.querySelector(
        ".NavBar_navbar_container_right_help__1YuG2"
      );

      if (!navbar.contains(event.target)) {
        setDiscover(false);
        setHelp(false);
        setNotification(false);
        setProfile(false);
      } else if (page.contains(event.target)) {
        if (discover == null || discover.contains(event.target)) {
          setDiscover(false);
          setHelp(false);
          setNotification(false);
          setProfile(false);
        }
      } else if (help.contains(event.target)) {
        if (listhelp == null || listhelp.contains(event.target)) {
          setDiscover(false);
          setHelp(false);
          setNotification(false);
          setProfile(false);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const {
    currentAccount,
    connectWallet,
    openError,
    fetchUserCart,
    deleteFromCart,
    cart,
    setCart,
    deleteAllCart,
    buyNFT,
  } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    const element = avatarRef.current;
    if (element && currentAccount) {
      const addr = currentAccount.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(45, seed);
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [currentAccount, avatarRef]);

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <DiJqueryLogo onClick={() => router.push("/")} />
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Tìm kiếm" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        {/* //END OF LEFT SECTION */}
        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            {/* DISCOVER MENU */}
            <p onClick={(e) => openMenu(e)}>Trang</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          {/* Trợ giúp */}
          <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>Trợ giúp</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          {/* Nút Tạo */}
          <div className={Style.navbar_container_right_button}>
            {currentAccount == "" ? (
              <Button
                btnName="Kết nối ví"
                handleClick={() => connectWallet()}
              />
            ) : (
              <div className={Style.navbar_container_right_button}>
                <Button
                  btnName="Tạo mới"
                  handleClick={() => router.push("/uploadNFT")}
                />
              </div>
            )}
          </div>
          {/* Hồ sơ người dùng */}
          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              {currentAccount == "" ? (
                <Image
                  src={images.avatar}
                  alt="Profile"
                  width={40}
                  height={40}
                  className={Style.navbar_container_right_profile}
                />
              ) : (
                <div ref={avatarRef} onClick={() => openProfile()}></div>
              )}

              {profile && (
                <Profile
                  openCart={handleToggle}
                  currentAccount={currentAccount}
                />
              )}
            </div>
          </div>

          {/* Nút menu */}
          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight
              className={Style.menuIcon}
              onClick={() => openSideBar()}
            />
          </div>

          {/* Giỏ hàng */}
          <div className={Style.navbar_container_right_notify}>
            <FaShoppingCart
              className={Style.notify}
              onClick={() => openNotification()}
            />
            <Cart
              isOpen={notification}
              fetchUserCart={fetchUserCart}
              deleteFromCart={deleteFromCart}
              cart={cart}
              setCart={setCart}
              deleteAllCart={deleteAllCart}
              buyNFT={buyNFT}
            />
            {notification && (
              <div
                className={Style.overlay}
                onClick={() => openNotification()}
              ></div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar
            setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  );
};

export default NavBar;
