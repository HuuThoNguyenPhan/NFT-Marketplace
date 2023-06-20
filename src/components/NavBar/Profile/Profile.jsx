import React, { useEffect, useRef } from "react";
import { FaUserAlt,FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

import Style from "./Profile.module.css";
import jazzicon from "@metamask/jazzicon";

const Profile = ({ currentAccount, openCart }) => {
  const avatarRef = useRef();
  useEffect(() => {
    const element = avatarRef.current;
    if (element && currentAccount) {
      const addr = currentAccount.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(45, seed); //generates a size 20 icon
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [currentAccount, avatarRef]);
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <div ref={avatarRef}></div>

        <div className={Style.profile_account_info}>
          <p>User_{currentAccount.slice(currentAccount.length - 4)}</p>
          <small>{currentAccount.slice(0, 3)}...{currentAccount.slice(currentAccount.length-4, currentAccount.length)}</small>
        </div>
      </div>

      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <Link href={{ pathname: "/author" }}>
            <div className={Style.profile_menu_one_item}>
              <FaUserAlt />
              <p>Hồ sơ</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
