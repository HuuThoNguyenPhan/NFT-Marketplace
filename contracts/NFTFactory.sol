// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTFactory is ERC721URIStorage {
    address payable ownerCT;

    constructor() ERC721("Metaverse Tokens", "METT") {
        ownerCT = payable(msg.sender);
    }

    mapping(uint256 => MarketItem) public idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        address author;
        uint256 royalties;
        bool isauction;
    }

    function addNFT(
        uint256 tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold,
        address author,
        uint256 royalties,
        bool isauction,
        address role
    ) public {
        require(role == ownerCT, "role must equal ownerCT");
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            seller,
            owner,
            price,
            sold,
            author,
            royalties,
            isauction
        );
        emit MarketItemCreated(
            tokenId,
            seller,
            owner,
            price,
            sold,
            tokenURI(tokenId),
            royalties,
            author,
            isauction
        );
    }

    event updateSale(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool isauction
    );

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        string idMG,
        uint256 royalties,
        address author,
        bool isuuction
    );

    function getAllNFT(
        uint256 length
    ) public view returns (MarketItem[] memory) {
        MarketItem[] memory results = new MarketItem[](length);
        for (uint256 i = 0; i < length; i++) {
            results[i] = idToMarketItem[i];
        }
        return results;
    }

    function detailNFT(uint256 id) public view returns (MarketItem memory) {
        return idToMarketItem[id];
    }

    function updateNFT(
        uint256 index,
        bool sold,
        uint256 price,
        address payable seller,
        address payable owner,
        bool isauction,
        address role
    ) public {
        require(role == ownerCT, "role must equal ownerCT");
        idToMarketItem[index].sold = sold;
        idToMarketItem[index].price = price;
        idToMarketItem[index].seller = payable(seller);
        idToMarketItem[index].owner = payable(owner);
        idToMarketItem[index].isauction = isauction;
        emit updateSale(index, seller, owner, price, sold, isauction);
    }

    function updatePriceNFT(uint256 index, uint256 price, address role) public {
        require(role == ownerCT, "role must equal ownerCT");
        idToMarketItem[index].price = price;
    }

    function banNFT(uint256 index, address role) public {
        require(role == ownerCT, "role must equal ownerCT");
        idToMarketItem[index].owner = payable(address(0));
    }

    function mint(address sender, uint256 tokenid, address role) public {
        require(role == ownerCT, "role must equal ownerCT");
        _mint(sender, tokenid);
    }

    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI,
        address role
    ) public {
        require(role == ownerCT, "role must equal ownerCT");
        _setTokenURI(tokenId, tokenURI);
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function transfer(
        address sender,
        address to,
        uint256 tokenId,
        address role
    ) public {
        require(role == ownerCT, "role must equal ownerCT");
        _transfer(sender, to, tokenId);
    }
}
