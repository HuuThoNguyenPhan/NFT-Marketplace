// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/NFTFactory.sol";

contract NFTMarketplace {
    NFTFactory public nftFactory;
    uint256 listingPrice = 0.025 ether;
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;
    Counters.Counter _itemsSold;
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the marketplace can change the listing price"
        );
        _;
    }

    constructor(address _nftFactory) {
        nftFactory = NFTFactory(_nftFactory);
        owner = payable(msg.sender);
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    /* Updates the listing price of the contract */
    function updateListingPrice(
        uint256 _listingPrice
    ) public payable onlyOwner {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(
        string[] memory tokenURI,
        uint256 price,
        uint256 royalties,
        bool auction
    ) public payable {
        for (uint256 i = 0; i < tokenURI.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            nftFactory.mint(msg.sender, newTokenId);
            nftFactory.setTokenURI(newTokenId, tokenURI[i]);
            createMarketItem(newTokenId, price, royalties, auction);
        }
    }

    function createMarketItem(
        uint256 tokenId,
        uint256 price,
        uint256 royalties,
        bool auction
    ) private {
        require(price > 0, "Price must be at least 1 wei");
        // uint256 fee = price * listingPrice / 100;
        //  require(
        //     msg.value == fee,
        //     "Price must be equal to listing price"
        // );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        if (auction == false) {
            nftFactory.addNFT(
                tokenId,
                payable(msg.sender),
                payable(address(this)),
                price,
                false,
                payable(msg.sender),
                royalties,
                false
            );
            nftFactory.transfer(msg.sender, address(this), tokenId);
        } else {
            _itemsSold.increment();
            nftFactory.addNFT(
                tokenId,
                payable(address(0)),
                payable(msg.sender),
                price,
                false,
                payable(msg.sender),
                royalties,
                false
            );
        }

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(
        uint256[] memory tokenId,
        uint256 price
    ) public payable {
        for (uint256 i = 0; i < tokenId.length; i++) {
            require(
                nftFactory.detailNFT(tokenId[i]).owner == msg.sender,
                "Only item owner can perform this operation"
            );
        }
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        for (uint256 i = 0; i < tokenId.length; i++) {
            nftFactory.updateNFT(
                tokenId[i],
                false,
                price,
                payable(msg.sender),
                payable(address(this)),
                false
            );
            _itemsSold.decrement();
            nftFactory.transfer(msg.sender, address(this), tokenId[i]);
        }
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256[] memory tokenId) public payable {
        for (uint256 i = 0; i < tokenId.length; i++) {
            require(
                nftFactory.detailNFT(tokenId[i]).sold == false,
                "Item is sold"
            );
        }
        uint256 price = 0;

        for (uint256 i = 0; i < tokenId.length; i++) {
            price = price + nftFactory.detailNFT(tokenId[i]).price;
        }

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        uint256 Fee = (msg.value * nftFactory.detailNFT(tokenId[0]).royalties) /
            100;
        uint256 countFee = Fee * tokenId.length;
        uint256 moneyReceived = msg.value - countFee;
        uint256 lastFee = msg.value - moneyReceived;

        payable(nftFactory.detailNFT(tokenId[0]).author).transfer(lastFee);
        payable(nftFactory.detailNFT(tokenId[0]).seller).transfer(
            moneyReceived
        );

        for (uint256 i = 0; i < tokenId.length; i++) {
            nftFactory.updateNFT(
                tokenId[i],
                true,
                nftFactory.detailNFT(tokenId[i]).price,
                payable(address(0)),
                payable(msg.sender),
                false
            );
            _itemsSold.increment();
            nftFactory.transfer(address(this), msg.sender, tokenId[i]);
        }

        payable(owner).transfer(listingPrice);
    }

    /* Returns all unsold market items */
    function fetchMarketItems()
        public
        view
        returns (NFTFactory.MarketItem[] memory)
    {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        NFTFactory.MarketItem[] memory items = new NFTFactory.MarketItem[](
            unsoldItemCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                nftFactory.detailNFT(i + 1).owner == address(this) &&
                nftFactory.detailNFT(i + 1).isauction == false
            ) {
                uint256 currentId = i + 1;
                items[currentIndex] = nftFactory.detailNFT(currentId);
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs(
        address user
    ) external view returns (NFTFactory.MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                nftFactory.detailNFT(i + 1).owner == user &&
                nftFactory.detailNFT(i + 1).isauction == false
            ) {
                itemCount += 1;
            }
        }

        NFTFactory.MarketItem[] memory items = new NFTFactory.MarketItem[](
            itemCount
        );
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                nftFactory.detailNFT(i + 1).owner == user &&
                nftFactory.detailNFT(i + 1).isauction == false
            ) {
                uint256 currentId = i + 1;
                items[currentIndex] = nftFactory.detailNFT(currentId);
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed(
        address user
    ) external view returns (NFTFactory.MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                nftFactory.detailNFT(i + 1).seller == user &&
                nftFactory.detailNFT(i + 1).isauction == false
            ) {
                itemCount += 1;
            }
        }

        NFTFactory.MarketItem[] memory items = new NFTFactory.MarketItem[](
            itemCount
        );
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                nftFactory.detailNFT(i + 1).seller == user &&
                nftFactory.detailNFT(i + 1).isauction == false
            ) {
                uint256 currentId = i + 1;
                items[currentIndex] = nftFactory.detailNFT(currentId);
                currentIndex += 1;
            }
        }
        return items;
    }
}
