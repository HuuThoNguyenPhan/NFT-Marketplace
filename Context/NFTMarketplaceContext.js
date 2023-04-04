import React, { useState, useEffect, useContext, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMDQ1MDQyYy03Y2FlLTQzZGMtYTliZS0wMDNmMmVjZDYzNDYiLCJlbWFpbCI6InRob3BybzIwMDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImE3OWQ2NDVkYjQyN2U4YWI5YTE5Iiwic2NvcGVkS2V5U2VjcmV0IjoiZjE0ODM1N2I5ZDA3MmIxZjMzZjlkM2U2YmFiODg4MWYwZGIxNjBlMjg0ZWQ3MDNhNDFlOTY3YTgzZTQ3N2RlNCIsImlhdCI6MTY3OTA3NDQ2Mn0.uK8viuDe9nYyzR2R_TGZMN98rfd1eZjfmWjMG3tNepI";
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
    if (
      sessionStorage.getItem("myAccount")
    ) {
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
  const uploadToIPFS = async (selectedFile, name, description) => {
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
  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image)
      return setError("Thiếu dữ liệu"), setOpenError(true);

    try {
      const url = await uploadToIPFS(image, name, description);

      await createSale(url, price);
      router.push("/searchPage");
    } catch (error) {
      setError("Lỗi khi tạo sản phẩm NFT");
      setOpenError(true);
    }
  };

  //--- createSale FUNCTION
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id);
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();
      console.error(listingPrice);
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
      // const contract = fetchContract(provider);

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
                "Access-Control-Allow-Origin": "*",
              },
            };

            console.log(tokenURI);
            const res = await axios(config);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            const metaData = res.data.rows[0].metadata.keyvalues;
            const name = metaData.name;
            const description = metaData.descreption;
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

  useEffect(() => {
    // if (currentAccount) {
    fetchNFTs();
    // }
  }, []);

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

              return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        console.log(items.length);
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
        openError,
        error,
        transferEther,
        getAllTransactions,
        loading,
        accountBalance,
        transactionCount,
        transactions,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};