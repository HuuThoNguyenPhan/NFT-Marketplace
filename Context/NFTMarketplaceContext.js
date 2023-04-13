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
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsAddress,
  transferFundsABI,
} from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

export const NFTMarketplaceContext = createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //------USESTATE
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const router = useRouter();

  const connectingWithSmartContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
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

      window.ethereum.on("accountsChanged", (account) => {
        setCurrentAccount(account[0]);
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

  const changeCurrency = async () => {
    const res = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR"
    );
    console.log(res);
  };

  useEffect(() => {
    // window.addEventListener("beforeunload", (event) => {
    //   event.preventDefault();
    //   event.returnValue = "";
    //   localStorage.clear();
    //   if (sessionStorage.getItem("myAccount")) {
    //     localStorage.setItem("myAccount", "exist");
    //     sessionStorage.setItem("myAccount", "exist");
    //   }
    // });
    console.log(localStorage.getItem("myAccount"));
    if (sessionStorage.getItem("myAccount")) {
      checkIfWalletConnected();
      connectingWithSmartContract();
    }
  }, []);

  //---Hàm kết nối ví
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Hãy cài đặt ví MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts);
      setCurrentAccount(accounts[0]);
      // localStorage.setItem("myAccount", "exist");
      sessionStorage.setItem("myAccount", "exist");

      // window.location.reload();
      connectingWithSmartContract();
    } catch (error) {
      setError("Lỗi khi kết nối ví");
      setOpenError(true);
    }
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadToIPFS = async (selectedFile, name, description, breed) => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: "File",
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
        pinataOptions: {
          cidVersion: 0,
        },
        pinataMetadata: {
          name: "Metadata",
          keyvalues: {
            name: name,
            descreption: description,
            image: IpfsHash,
            typeFile: selectedFile.type.slice(
              0,
              selectedFile.type.indexOf("/")
            ),
            size: (selectedFile.size / 1048576).toFixed(2),
            breed: breed,
          },
        },
        pinataContent: {
          somekey: new Date().getTime(),
        },
      });

      console.log(data);
      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + JWT,
        },
        data: data,
      };
      const resMetadata = await axios(config);
      return "https://gateway.pinata.cloud/ipfs/" + resMetadata.data.IpfsHash;
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
    quantity
  ) => {
    if (!name || !description || !price || !image || !quantity)
      return setError("Thiếu dữ liệu"), setOpenError(true);

    try {
      const urls = [];

      const breed = quantity > 1 ? name + new Date().getTime() : 1;

      for (let i = 0; i < quantity; i++) {
        const url = await uploadToIPFS(image, name, description, breed);
        urls.push(url);
      }

      await createSale(urls, price, quantity);
      router.push("/searchPage");
    } catch (error) {
      setError("Lỗi khi tạo sản phẩm NFT");
      setOpenError(true);
    }
  };

  //--- createSale FUNCTION
  const createSale = async (url, formInputPrice, quantity, isReselling, id) => {
    try {
      const price = ethers.utils.parseUnits("100", "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
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

  //--FETCHNFTS FUNCTION

  const fetchNFTs = async () => {

    try {
      // if (currentAccount
      // const web3Modal = new Web3Modal();
      // const connection = await web3Modal.connect();
      // const provider = new ethers.providers.Web3Provider(connection);) {

      // const provider = new ethers.providers.JsonRpcProvider(
      //   "https://polygon-mumbai.g.alchemy.com/v2/Yq1F4URSZIlAfsBKQiv_PAD5P3Fn6N6z"
      // );

      const provider = new ethers.providers.JsonRpcProvider();

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            var config = {
              method: "get",
              url:
                "https://api.pinata.cloud/data/pinList?hashContains=" +
                tokenURI.slice(34, tokenURI.length),
              headers: {
                Authorization: "Bearer " + JWT,
              },
            };

            const res = await axios(config);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            const metaData = res.data.rows[0].metadata.keyvalues;
            const name = metaData.name;
            const description = metaData.descreption;
            const typeFile = metaData.typeFile;
            const breed = metaData.breed;
            const size = metaData.size;
            // const image = "https://ipfs.io/ipfs/" + metaData.image.slice(7,metaData.image.length);
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
            };
          }
        )
      );

      return items;

      // }
    } catch (error) {
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
        const contract = await connectingWithSmartContract();
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
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              var config = {
                method: "get",
                url:
                  "https://api.pinata.cloud/data/pinList?hashContains=" +
                  tokenURI.slice(34, tokenURI.length),
                headers: {
                  Authorization: "Bearer " + JWT,
                  "Access-Control-Allow-Origin": "*",
                },
              };

              const res = await axios(config);

              const metaData = res.data.rows[0].metadata.keyvalues;
              const name = metaData.name;
              const description = metaData.descreption;
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
                breed,
              };
            }
          )
        );

        return items;
      }
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  //---BUY NFTs FUNCTION
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Lỗi khi mua sản phẩm NFT");
      setOpenError(true);
    }
  };

  //------------------------------------------------------------------

  //----TRANSFER FUNDS

  const fetchTransferFundsContract = (signerOrProvider) =>
    new ethers.Contract(
      transferFundsAddress,
      transferFundsABI,
      signerOrProvider
    );

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
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
