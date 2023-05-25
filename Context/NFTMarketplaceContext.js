import React, { useState, useEffect, useContext, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYWU1MDFhYi02OGE3LTQzYjMtYWM2NS04ZDNjNWIxYTQ2NzkiLCJlbWFpbCI6ImRldi5odXV0aG9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjkyMTQwNmFlOTc5YzJjOWM3OTczIiwic2NvcGVkS2V5U2VjcmV0IjoiMzQyMmJmMzM0NGI1YjVkMDk2MmM2N2U0NjIxMTcwZmY1NzFkYTA3ZmU1MDU0YzNiNmFlODBjNGJmNjgxMjljYyIsImlhdCI6MTY4MTM3MTMzM30.KEvJUpkaL1SQcv8YonaMXplrKWJw82yQRF9FUKT7WM0";
const subdomain = "your subdomain";

import {
  NFTMarketplaceABI,
  FactoryABI,
  AuctionABI,
  transferFundsABI,
} from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = async (signerOrProvider) => {
  const {
    data: { address },
  } = await axios.get("http://localhost:5000/api/v1/addresses");
  return new ethers.Contract(
    address.nftmarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
};
export const NFTMarketplaceContext = createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //------USESTATE
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [idAccount, setIdAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const router = useRouter();

  const credential = async (
    name,
    description,
    reason,
    contact,
    image,
    country
  ) => {
    const bodyContent = {
      _id: idAccount,
      name,
      description,
      reason,
      contact,
      image,
      country,
    };

    const response = await axios.put(
      "http://localhost:5000/api/v1/user/update",
      bodyContent
    );
    console.log(response.data);
    if (response.data.success == true) {
      router.push("/").then(() => {
        alert("Đã gửi xác thực");
      });
    } else if (response.data.success == false) {
      alert("Bạn đang trong quá trình chờ duyệt");
    }
  };

  const connectingWithSmartContract = async (func) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await func(signer);
      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with contract", error);
    }
  };

  //---CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Hãy cài đặt ví MetaMask");

      window.ethereum.on("accountsChanged", async (account) => {
        setCurrentAccount(account[0]);
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/create",
          {
            address: account[0],
          }
        );
        console.log(res);
        setIdAccount(res.data.user._id);
      });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        setError("Không tìm thấy tài khoản");
        setOpenError(true);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
    } catch (error) {
      setError("Lỗi khi kết nối ví");
      setOpenError(true);
      console.log("not connected");
    }
  };

  const changeCurrency = async (price) => {
    const res1 = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"
    );
    const res2 = await axios.get(
      `https://api.api-ninjas.com/v1/convertcurrency?have=USD&want=VND&amount=${
        res1.data.USD * price
      }`
    );
    const VND = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    const finalPrice = VND.format(res2.data.new_amount).replace("₫", "VNĐ");

    return finalPrice;
  };

  // useEffect(() => {
  //   // window.addEventListener("beforeunload", (event) => {
  //   //   event.preventDefault();
  //   //   event.returnValue = "";
  //   //   localStorage.clear();
  //   //   if (sessionStorage.getItem("myAccount")) {
  //   //     localStorage.setItem("myAccount", "exist");
  //   //     sessionStorage.setItem("myAccount", "exist");
  //   //   }
  //   // });

  //   checkIfWalletConnected();
  //   connectingWithSmartContract();
  // }, []);

  //---Hàm kết nối ví
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Hãy cài đặt ví MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      if (accounts[0]) {
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/create",
          {
            address: accounts[0],
          }
        );
        console.log(res);
        setIdAccount(res.data.user._id);
      }

      // localStorage.setItem("myAccount", "exist");
      sessionStorage.setItem("myAccount", "exist");

      // window.location.reload();
      connectingWithSmartContract(fetchContract);
    } catch (error) {
      setError("Lỗi khi kết nối ví");
      setOpenError(true);
    }
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadToIPFS = async (
    selectedFile,
    name,
    description,
    breed,
    limit,
    genealogy
  ) => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: "File",
      typeFile: selectedFile.type.slice(0, selectedFile.type.indexOf("/")),
      size: (selectedFile.size / 1048576).toFixed(2),
      createdAt: new Date(),
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: "Bearer " + JWT,
          },
        }
      );

      const IpfsHash = "ipfs://" + res.data.IpfsHash;

      var data = JSON.stringify({
        Metadata: {
          name: name,
          descreption: description,
          image: IpfsHash,
          typeFile: selectedFile.type.slice(0, selectedFile.type.indexOf("/")),
          size: (selectedFile.size / 1048576).toFixed(2),
          // categories: categories,
          genealogy: genealogy,
          breed: breed,
          limit: limit,
        },
      });

      var config = {
        method: "post",
        url: "http://localhost:5000/api/v1/products/create",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      const resMetadata = await axios(config);
      // return "https://gateway.pinata.cloud/ipfs/" + resMetadata.data.IpfsHash;

      return `http://localhost:5000/api/v1/products/${resMetadata.data.metaData._id}`;
    } catch (error) {
      console.log(error);
      setError("Lỗi khi tải tệp lên ");
      setOpenError(true);
    }
  };

  //---CREATENFT FUNCTION
  const createNFT = async (
    name,
    price,
    image,
    description,
    router,
    quantity,
    limit,
    isAuction,
    royalties
  ) => {
    if (!name || !description || !price || !image || !quantity || !limit)
      return setError("Thiếu dữ liệu"), setOpenError(true);

    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    try {
      const urls = [];

      const breed = quantity > 1 ? name + new Date().getTime() : 1;
      const genealogy = "genealogy" + name + new Date().getTime();
      for (let i = 0; i < quantity; i++) {
        let url = await uploadToIPFS(
          image,
          name,
          description,
          breed,
          limit,
          genealogy
        );
        urls.push(url);
        await sleep(2000);
      }

      await createSale(urls, price, quantity, false, [], isAuction, royalties);
      router.push("/searchPage");
    } catch (error) {
      console.log(error);
      setError("Lỗi khi tạo sản phẩm NFT");
      setOpenError(true);
    }
  };

  //--- createSale FUNCTION
  const createSale = async (
    url,
    formInputPrice,
    quantity,
    isReselling,
    ids,
    isAuction,
    royalties
  ) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice.toString(), "ether");

      const contract = await connectingWithSmartContract(fetchContract);

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, royalties, isAuction, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(ids, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
  };

  const createAuction = async (
    tokenId,
    initialPrice,
    startTime,
    endTime,
    name
  ) => {
    try {
      const price = ethers.utils.parseEther(initialPrice.toString());
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = await connectingWithSmartContract(fetchAuctionContract);
      const contract2 = await fetchContract(provider);

      const listingPrice = await contract2.getListingPrice();
      let rawStartTime = new Date(startTime).getTime();
      let rawEndTime = new Date(endTime).getTime();
      const transaction = await contract.createAuction(
        tokenId,
        price,
        rawStartTime,
        rawEndTime
        // {value : listingPrice.toString()}
      );

      const item = await fetchTokenURI([tokenId]);
      let header = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      let body = JSON.stringify({
        time: name + new Date().getTime().toString(),
        ids: [item[0]],
      });
      let req = {
        url: "http://localhost:5000/api/v1/products/changeBreed",
        method: "POST",
        headers: header,
        data: body,
      };

      await transaction.wait();
      await axios.request(req);
      router.push("/searchPage");
    } catch (error) {
      setError("Lỗi khi tạo đấu giá");
      setOpenError(true);
      console.log(error);
    }
  };

  const cancleAuction = async (auctionId, type) => {
    try {
      const contract = await connectingWithSmartContract(fetchAuctionContract);
      const transaction =
        type == true
          ? await contract.cancleAuction(auctionId)
          : await contract.finishAuction(auctionId);
      await transaction.wait();
    } catch (error) {
      setError("Lỗi khi hủy đấu giá");
      setOpenError(true);
      console.log(error);
    }
  };

  const joinAuction = async (auctionId,bid) => {
    try {
      const price = ethers.utils.parseEther(bid.toString());
      const contract = await connectingWithSmartContract(fetchAuctionContract);
      const transaction = await contract.joinAuction(auctionId,price,{value:price.toString()});
      await transaction.wait();
    } catch (error) {
      setError("Lỗi khi tham gia đấu giá");
      setOpenError(true);
      console.log(error);
    }
  }

  const fetchTokenURI = async (tokenIds) => {
    if (typeof tokenIds == "string") {
      tokenIds = [tokenIds];
    }

    const provider = new ethers.providers.JsonRpcProvider();
    const contract = await fetchFactoryContract(provider);
    const tokenURIs = await Promise.all(
      tokenIds.map(async (tokenId) => {
        let final = await contract.tokenURI(parseInt(tokenId));
        final = final.slice(38, final.length);
        return final;
      })
    );

    return tokenURIs;
  };

  const fetchDetailAuction = async (auc) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = await fetchAuctionContract(provider);
      const contract2 = await fetchFactoryContract(provider);
      const data = await contract.getAuction(auc);

      const {
        auctioneer,
        _tokenId,
        initialPrice,
        previousBidder,
        lastBid,
        lastBidder,
        startTime,
        endTime,
        completed,
        active,
        auctionId,
      } = data;
      {
        console.log(endTime);
        const tokenURI = await contract2.tokenURI(_tokenId);
        const id = tokenURI.slice(38, tokenURI.length);
        var config = {
          method: "get",
          url: "http://localhost:5000/api/v1/products/" + id,
          headers: {
            // Authorization: "Bearer " + JWT,
          },
        };

        const res = await axios(config);
        const initPrice = ethers.utils.formatUnits(
          initialPrice.toString(),
          "ether"
        );
        const lastPrice = ethers.utils.formatUnits(lastBid.toString(), "ether");
        var remaining = Math.floor(
          (endTime.toNumber() - new Date().getTime()) / 1000
        );

        const metaData = res.data.products;
        const name = metaData.name;
        const description = metaData.descreption;
        const typeFile = metaData.typeFile;
        const breed = metaData.breed;
        const size = metaData.size;
        const limit = metaData.limit;
        const image =
          "https://gateway.pinata.cloud/ipfs/" +
          metaData.image.slice(7, metaData.image.length);

        return {
          tokenId: _tokenId.toNumber(),
          image,
          name,
          description,
          tokenURI,
          typeFile,
          breed,
          size,
          limit,
          seller: auctioneer,
          initPrice,
          previousBidder,
          price: lastPrice,
          lastBidder,
          startTime,
          endTime,
          remaining,
          completed,
          active,
          auctionId: auctionId.toNumber(),
          owner: "0",
        };
      }
    } catch (error) {
      console.log(error);
      setError("Error while fetching NFTS");
      setOpenError(true);
    }
  };

  const fetchAuction = async (active) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = await fetchAuctionContract(provider);
      const contract2 = await fetchFactoryContract(provider);
      const data = await contract.getAuctionByStatus(active);
      const items = await Promise.all(
        data.map(
          async ({
            auctioneer,
            _tokenId,
            initialPrice,
            previousBidder,
            lastBid,
            lastBidder,
            startTime,
            endTime,
            completed,
            active,
            auctionId,
          }) => {
            const tokenURI = await contract2.tokenURI(_tokenId);
            const id = tokenURI.slice(38, tokenURI.length);
            var config = {
              method: "get",
              url: "http://localhost:5000/api/v1/products/" + id,
              headers: {
                // Authorization: "Bearer " + JWT,
              },
            };

            const res = await axios(config);
            const initPrice = ethers.utils.formatUnits(
              initialPrice.toString(),
              "ether"
            );
            const lastPrice = ethers.utils.formatUnits(
              lastBid.toString(),
              "ether"
            );
            var remaining = Math.floor(
              (endTime.toNumber() - new Date().getTime()) / 1000
            );

            const metaData = res.data.products;
            const name = metaData.name;
            const description = metaData.descreption;
            const typeFile = metaData.typeFile;
            const breed = metaData.breed;
            const size = metaData.size;
            const limit = metaData.limit;
            const image =
              "https://gateway.pinata.cloud/ipfs/" +
              metaData.image.slice(7, metaData.image.length);
            const seller = 0;
            const owner = 0;
            return {
              tokenId: _tokenId.toNumber(),
              image,
              name,
              description,
              tokenURI,
              typeFile,
              breed,
              size,
              limit,
              auctioneer,
              initPrice,
              previousBidder,
              lastPrice,
              lastBidder,
              startTime,
              endTime,
              remaining,
              completed,
              active,
              auctionId: auctionId.toNumber(),
            };
          }
        )
      );

      return items;

      // }
    } catch (error) {
      console.log(error);
      setError("Error while fetching NFTS");
      setOpenError(true);
    }
  };

  const fetchFactoryContract = async (signerOrProvider) => {
    const {
      data: { address },
    } = await axios.get("http://localhost:5000/api/v1/addresses");
    return new ethers.Contract(
      address.nftFactory,
      FactoryABI,
      signerOrProvider
    );
  };

  const fetchAuctionContract = async (signerOrProvider) => {
    const {
      data: { address },
    } = await axios.get("http://localhost:5000/api/v1/addresses");
    return new ethers.Contract(
      address.auctionAddress,
      AuctionABI,
      signerOrProvider
    );
  };

  //--FETCHNFTS FUNCTION
  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = await fetchContract(provider);
      const contract2 = await fetchFactoryContract(provider);
      const data = await contract.fetchMarketItems();
      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            price: unformattedPrice,
            royalties,
            author,
          }) => {
            const tokenURI = await contract2.tokenURI(tokenId);
            const id = tokenURI.slice(38, tokenURI.length);
            var config = {
              method: "get",
              url: "http://localhost:5000/api/v1/products/" + id,
              headers: {
                // Authorization: "Bearer " + JWT,
              },
            };

            const res = await axios(config);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            const metaData = res.data.products;
            const name = metaData.name;
            const description = metaData.descreption;
            const typeFile = metaData.typeFile;
            const breed = metaData.breed;
            const size = metaData.size;
            const limit = metaData.limit;
            const image =
              "https://gateway.pinata.cloud/ipfs/" +
              metaData.image.slice(7, metaData.image.length);

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
              typeFile,
              breed,
              size,
              limit,
              royalties: royalties.toNumber(),
              author,
            };
          }
        )
      );

      return items;

      // }
    } catch (error) {
      console.log(error);
      setError("Error while fetching NFTS");
      setOpenError(true);
    }
  };

  // useEffect(() => {
  //   if (currentAccount) {
  //     fetchNFTs();
  //   }
  // }, []);

  //--Sở hữu
  const fecthOwner = async (listTokenId) => {
    try {
      if (currentAccount) {
        if (listTokenId.length == 1) {
          listTokenId = [listTokenId];
        }
        const provider = new ethers.providers.JsonRpcProvider();

        const contract = await fetchFactoryContract(provider);
        let owners = await Promise.all(
          listTokenId.map(async (tokenId) => await contract.ownerOf(tokenId))
        );
        return owners;
      }
    } catch {
      console.log(error);
    }
  };

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs = async (type, address) => {
    console.log(address);
    try {
      const contract = await connectingWithSmartContract(fetchContract);

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed(address)
          : await contract.fetchMyNFTs(address);

      const provider = new ethers.providers.JsonRpcProvider();
      const contract2 = await fetchFactoryContract(provider);
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract2.tokenURI(tokenId);
            const id = tokenURI.slice(38, tokenURI.length);
            var config = {
              method: "get",
              url: "http://localhost:5000/api/v1/products/" + id,
              headers: {
                // Authorization: "Bearer " + JWT,
              },
            };

            const res = await axios(config);

            const metaData = res.data.products;
            const name = metaData.name;
            const description = metaData.descreption;
            const typeFile = metaData.typeFile;
            const size = metaData.size;
            const limit = metaData.limit;
            // const image = "https://ipfs.io/ipfs/" + metaData.image.slice(7,metaData.image.length);
            const image =
              "https://gateway.pinata.cloud/ipfs/" +
              metaData.image.slice(7, metaData.image.length);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            const breed = metaData.breed;
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
              typeFile,
              breed,
              size,
              limit,
            };
          }
        )
      );

      return items;
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };

  // useEffect(() => {
  //   fetchMyNFTsOrListedNFTs();
  // }, []);

  //---BUY NFTs FUNCTION
  const buyNFT = async (nft, limit) => {
    try {
      console.log(nft);
      const contract = await connectingWithSmartContract(fetchContract);
      const time = nft.name + new Date().getTime();
      nft.price = nft.price * limit;
      console.log(nft.price);
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(price.toString());
      const finalItem = [];
      const item = await fetchTokenURI(nft.tokenIds);
      for (let i = 0; i < limit; i++) {
        finalItem.push(item[i]);
      }
      let header = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };
      let body = JSON.stringify({
        time: time.toString(),
        ids: finalItem,
      });
      let req = {
        url: "http://localhost:5000/api/v1/products/changeBreed",
        method: "POST",
        headers: header,
        data: body,
      };

      const ids = [];
      for (let i = 0; i < limit; i++) {
        ids.push(parseInt(nft.tokenIds[i]));
      }

      const transaction = await contract.createMarketSale(ids, {
        value: price,
      });

      await transaction.wait();
      await axios.request(req);
      router.push("/author");
    } catch (error) {
      console.log(error);
      setError("Bạn đã từ chối NFT");
      setOpenError(true);
    }
  };

  //------------------------------------------------------------------

  //----TRANSFER FUNDS

  const fetchTransferFundsContract = async (signerOrProvider) => {
    const {
      data: { address },
    } = await axios.get("http://localhost:5000/api/v1/addresses");
    return new ethers.Contract(
      address.transferFundsAddress,
      NFTMarketplaceABI,
      signerOrProvider
    );
  };

  const connectToTransferFunds = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchTransferFundsContract(signer);
      return contract;
    } catch (error) {
      console.log(error);
    }
  };
  //---TRANSFER FUNDS
  const [transactionCount, setTransactionCount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transferEther = async (address, ether, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFunds();
        console.log(address, ether, message);

        const unFormatedPrice = ethers.utils.parseEther(ether);
        // //FIRST METHOD TO TRANSFER FUND
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "0x5208",
              value: unFormatedPrice._hex,
            },
          ],
        });

        const transaction = await contract.addDataToBlockchain(
          address,
          unFormatedPrice,
          message
        );

        console.log(transaction);

        setLoading(true);
        transaction.wait();
        setLoading(false);

        const transactionCount = await contract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //FETCH ALL TRANSACTION
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFunds();

        const avaliableTransaction = await contract.getAllTransactions();

        const readTransaction = avaliableTransaction.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));

        setTransactions(readTransaction);
        console.log(transactions);
      } else {
        console.log("On Ethereum");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        setError,
        openError,
        error,
        transferEther,
        getAllTransactions,
        loading,
        accountBalance,
        transactionCount,
        transactions,
        fecthOwner,
        changeCurrency,
        fetchTokenURI,
        credential,
        createAuction,
        fetchAuction,
        fetchDetailAuction,
        cancleAuction,
        joinAuction
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
