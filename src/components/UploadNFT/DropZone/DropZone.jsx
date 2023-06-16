import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import { useDropzone } from "react-dropzone";
import Image from "next/image";

import Style from "./DropZone.module.css";
import images from "../../../assets/img";

import { NFTMarketplaceContext } from "../../../../Context/NFTMarketplaceContext";
import * as jsmediatags from "jsmediatags";

const DropZone = ({
  title,
  heading,
  subHeading,
  name,
  description,
  royalties,
  topics,
  quantity,
  setImage,
  setFileSize,
  fileSize,
  image,
}) => {
  const { setError, setOpenError } = useContext(NFTMarketplaceContext);
  const [fileUrl, setFileUrl] = useState("");
  const [fileAva, setFileAva] = useState("");
  const videoRef = useRef();
  useEffect(() => {
    setError(), setOpenError();
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const onDrop = useCallback(async (acceptedFile) => {
    if ((acceptedFile[0].size / 1048576).toFixed(2) <= 25) {
      setFileSize((acceptedFile[0].size / 1048576).toFixed(4));
      setFileUrl(URL.createObjectURL(acceptedFile[0]));
      setImage(acceptedFile[0]);
      jsmediatags.read(acceptedFile[0], {
        onSuccess: function (tag) {
          const image = tag.tags.picture;
          if (image) {
            const base64String = arrayBufferToBase64(image.data);
            setFileAva(`data:${image.format};base64,${base64String}`);
          } else {
            setFileAva(images.music_ava);
          }
        },
        onError: function (error) {
          console.log(error);
        },
      });
    } else {
      setError("Kích thước tệp nhỏ hơn hoặc bằng 25MB"), setOpenError(true);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  useEffect(() => {
    videoRef.current?.load();
  }, [fileUrl]);
  const renderPreview = (typeFile) => {
    switch (typeFile.slice(0, typeFile.indexOf("/"))) {
      case "image":
        return (
          <Image
            className={Style.image}
            src={fileUrl}
            alt="nft image"
            width={200}
            height={200}
          />
        );
      case "audio":
        return (
          // <Image
          //     className={Style.image}
          //     src={fileAva}
          //     alt="nft image"
          //     width={200}
          //     height={200}
          //   />
          <Image
            className={Style.image}
            src={fileAva}
            alt="nft image"
            width={200}
            height={200}
          />
        );
      case "video":
        return (
          <video
            ref={videoRef}
            width="200"
            height="150"
            controls
            style={{ margin: "0 auto" }}
          >
            <source src={fileUrl} type="video/mp4" />
          </video>
        );

      default:
        return (
          <Image
            className={Style.image}
            src={images.file}
            alt="nft image"
            width={200}
            height={200}
          />
        );
    }
  };

  return (
    <div className={Style.DropZone}>
      <div className={Style.DropZone_box} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.DropZone_box_input}>
          <p>{title}</p>
          <div className={Style.DropZone_box_input_img}>
            <Image
              src={images.upload}
              alt="upload"
              width={100}
              height={100}
              objectFit="contain"
              className={Style.DropZone_box_input_img_img}
            />
          </div>
          <p>{heading}</p>
          <p>{subHeading}</p>
        </div>
      </div>

      {fileUrl && (
        <aside className={Style.DropZone_box_aside}>
          <div className={Style.DropZone_box_aside_box}>
            {fileUrl && renderPreview(image.type)}

            <div className={Style.DropZone_box_aside_box_preview}>
              {image.type.slice(0, image.type.indexOf("/")) == "audio" && (
                <audio ref={videoRef} className={Style.audio_player} controls>
                  <source src={fileUrl} />
                </audio>
              )}
              <div className={Style.DropZone_box_aside_box_preview_one}>
                <p>
                  <samp>Tên NFT: </samp>
                  {name || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_two}>
                <p>
                  <span>Mô tả: </span>
                  {description || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_three}>
                <p>
                  <span>Tiền bản quyền: </span>
                  {royalties || ""}
                </p>
                <p>
                  <span>Kích thước: </span>
                  {fileSize + " MB" || ""}
                </p>
                <p>
                  <span>Số lượng: </span>
                  {quantity || ""}
                </p>
                <p>
                  <span>Chủ đề: </span>
                  {topics.filter(item => item.active === true).map(item => item.topicName + ", ") || ""}
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DropZone;
