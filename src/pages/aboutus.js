import React from "react";
import Image from "next/image";

import Style from "../styles/aboutus.module.css";
import { Brand } from "../components/componentsindex";
import images from "../assets/img";

const aboutus = () => {
  const founderArray = [
    {
      name: "Nguyễn Phan Hữu Thọ",
      position: "Thiết kế giao diện Web và Mobile App",
      images: images.founder1,
    },
    {
      name: "Nguyễn Ngọc Ý",
      position: "Thiết kế xử lý toàn bộ dự án",
      images: images.founder3,
    },
  ];

  const factsArray = [
    {
      title: "10 million",
      info: "Articles have been public around the world (as of Sept. 30, 2021)",
    },
    {
      title: "100,000",
      info: "Registered users account (as of Sept. 30, 2021)",
    },
    {
      title: "220+",
      info: "Countries and regions have our presence (as of Sept. 30, 2021",
    },
  ];
  return (
    <div className={Style.aboutus}>
      <div className={Style.aboutus_box}>
        <div className={Style.aboutus_box_hero}>
          <div className={Style.aboutus_box_hero_left}>
            <h1>👋 Về chúng tôi.</h1>
            <p>
              Là những sinh viên năm cuối, chúng tôi muốn làm gì đó thoát khỏi
              vùng an toàn và tạo sự khác biệt. Dự án này mang lại nhiều kiến thức mới
              mẻ, nhiều lúc gặp nhiều khó khăn dẫn đến bế tắc, mất phương hướng,
              mất thời gian và mệt mỏi nhưng đổi lại được sự kiên nhẫn và quyết
              tâm đi tiếp để thưởng thức được những phút giây cuối cùng của đời
              sinh viên.
            </p>
          </div>
          <div className={Style.aboutus_box_hero_right}>
            <Image src={images.hero2} />
          </div>
        </div>

        <div className={Style.aboutus_box_title}>
          <h2>⛱ Người thực hiện</h2>

        </div>

        <div className={Style.aboutus_box_founder}>
          <div className={Style.aboutus_box_founder_box}>
            {founderArray.map((el, i) => (
              <div className={Style.aboutus_box_founder_box_img}>
                <Image
                  src={el.images}
                  alt={el.name}
                  width={500}
                  height={500}
                  className={Style.aboutus_box_founder_box_img_img}
                />
                <h3>{el.name}</h3>
                <p>{el.position}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={Style.aboutus_box_title}>
          <h2>🚀 Fast Facts</h2>
          <p>
            We’re impartial and independent, and every day we create
            distinctive, world-class programmes and content
          </p>
        </div>

        <div className={Style.aboutus_box_facts}>
          <div className={Style.aboutus_box_facts_box}>
            {factsArray.map((el, i) => (
              <div className={Style.aboutus_box_facts_box_info}>
                <h3>{el.title}</h3>
                <p>{el.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default aboutus;
