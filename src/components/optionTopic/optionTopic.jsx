import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./optionTopic.module.css";
import images from "../../assets/img";

//SMAFRT CONTRCAT IMPORT CONTEXT
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import { Button } from "../componentsindex";

const OptionTopic = ({ setOpen, topics, setTopics }) => {
  return (
    <div className={Style.Topic}>
      <div className={Style.Topic_box}>
        <h3>Danh sách chủ đề</h3>
        <hr />
        <div className={Style.Topic_box_content}>
          {topics.map((el, i) => (
            <Button
              btnName={el.topicName}
              classStyle2={el.active == true ? Style.Topic_box_btn_Active : ""}
              value={el.topicName}
              handleClick={setTopics}
            />
          ))}
        </div>
        <div className={Style.Topic_box_btn}>
          <Button
            value={false}
            handleClick={() => {
              setOpen();
              document.querySelector("body").style.overflow = "";
            }}
            btnName="Tiếp tục"
          />
        </div>
      </div>
    </div>
  );
};

export default OptionTopic;
