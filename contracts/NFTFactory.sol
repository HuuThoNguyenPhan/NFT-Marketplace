// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTFactory is ERC721URIStorage {
    constructor() ERC721("Metaverse Tokens", "METT") {}

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
        bool isauction
    ) public {
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
    }

    function getAllNFT(uint256 length)
        public
        view
        returns (MarketItem[] memory)
    {
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
        bool isauction
    ) public {
        idToMarketItem[index].sold = sold;
        idToMarketItem[index].price = price;
        idToMarketItem[index].seller = payable(seller);
        idToMarketItem[index].owner = payable(owner);
         idToMarketItem[index].isauction = isauction;
    }

    function mint(address sender, uint256 tokenid) public {
        _mint(sender, tokenid);
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public {
        _setTokenURI(tokenId, tokenURI);
    }

    function transfer(
        address sender,
        address to,
        uint256 tokenId
    ) public {
        _transfer(sender, to, tokenId);
    }
}
