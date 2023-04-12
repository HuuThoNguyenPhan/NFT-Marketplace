import React, { useState, useCallback, useContext, useEffect } from "react";

import { useDropzone } from "react-dropzone";
import Image from "next/image";

import Style from "./DropZone.module.css";
import images from "../../../assets/img";

import { NFTMarketplaceContext } from "../../../../Context/NFTMarketplaceContext";


const DropZone = ({
  title,
  heading,
  subHeading,
  name,
  website,
  description,
  royalties,
  category,
  properties,
  setImage,
  setFileSize,
  fileSize,
  image,
}) => {
  const { setError, setOpenError } = useContext(NFTMarketplaceContext);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    setError(), setOpenError();
  }, []);

  const onDrop = useCallback(async (acceptedFile) => {
    if ((acceptedFile[0].size / 1048576).toFixed(2) <= 25) {
      setFileSize((acceptedFile[0].size / 1048576).toFixed(2));
      setFileUrl(URL.createObjectURL(acceptedFile[0]));
      setImage(acceptedFile[0]);
    } else {
      setError("Kích thước tệp nhỏ hơn hoặc bằng 25MB"), setOpenError(true);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const renderPreview = (typeFile) => {
    
    switch (typeFile.slice(0, typeFile.indexOf("/"))) {
      case "image":
        return <Image className={Style.image} src={fileUrl} alt="nft image" width={200} height={200} />;
        break;
      case "audio":
        return (
          <audio controls style={{ margin: "0 auto" }}>
            <source src={fileUrl} />
          </audio>
        );
        break;
        case "video":
          return (
            <video  width="200" height="150" controls style={{ margin: "0 auto" }}>
              <source src={fileUrl} type="video/mp4"/>
            </video>
          );
          break;
      default:
        return <Image className={Style.image} src={images.file} alt="nft image" width={200} height={200} />;
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
              <div className={Style.DropZone_box_aside_box_preview_one}>
                <p>
                  <samp>NFT Name:</samp>
                  {name || ""}
                </p>
                <p>
                  <samp>Website:</samp>
                  {website || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_two}>
                <p>
                  <span>Description</span>
                  {description || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_three}>
                <p>
                  <span>Royalties</span>
                  {royalties || ""}
                </p>
                <p>
                  <span>FileSize</span>
                  {fileSize + " MB" || ""}
                </p>
                <p>
                  <span>Properties</span>
                  {properties || ""}
                </p>
                <p>
                  <span>Category</span>
                  {category || ""}
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
