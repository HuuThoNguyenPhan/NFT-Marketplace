import React from "react";
import Link from "next/link";

import Style from "./HelpCenter.module.css";

const HelpCenter = () => {
  const helpCenter = [
    {
      name: "Giới thiệu",
      link: "aboutus",
    },
    {
      name: "Liên lạc",
      link: "contactus",
    },
    {
      name: "Chuyển tiền",
      link: "transferFunds"
    },
    {
      name: "Xác thực người dùng",
      link: "credential"
    }
  ];
  return (
    <div className={Style.box}>
      {helpCenter.map((el, i) => (
        <div className={Style.helpCenter} key={i + 1}>
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;
