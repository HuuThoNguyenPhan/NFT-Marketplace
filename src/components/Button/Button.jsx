import React from "react";

import Style from "./Button.module.css";

const Button = ({ btnName, handleClick, icon, classStyle, classStyle2, value }) => {
  return (
    <div className={Style.box}>
      <button
        className={`${Style.button} ${classStyle2} ${classStyle}`}
        onClick={() => handleClick(value)}
      >
        {icon} {btnName}
      </button>
    </div>
  );
};

export default Button;
