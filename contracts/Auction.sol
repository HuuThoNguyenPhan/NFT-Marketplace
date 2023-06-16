// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/NFTFactory.sol";

contract Auction {
    NFTFactory public nftFactory;
    uint256 public constant MINIMUM_BID_RATE = 110;
    uint256 public AUCTION_SERVICE_FEE_RATE = 3;
    address payable owner;

    constructor(address _nftFactory) {
        nftFactory = NFTFactory(_nftFactory);
        owner = payable(msg.sender);
    }

    struct AuctionInfo {
        address auctioneer;
        uint256 _tokenId;
        uint256 initialPrice;
        address previousBidder;
        uint256 lastBid;
        address lastBidder;
        uint256 startTime;
        uint256 endTime;
        bool completed;
        bool active;
        uint256 auctionId;
    }

    AuctionInfo[] private auction;

    event join(address bidder, uint256 amount, uint256 auctionId);
    function getBlockTime() public view returns (uint256) {
        return block.timestamp;
    }

    function createAuction(
        uint256 _tokenId,
        uint256 _initialPrice,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        // require(block.timestamp <= _startTime, "Auction has not started yet");
        require(
            _startTime <= _endTime,
            "Auction can not end before it has started"
        );
        require(0 < _initialPrice, "Initial price must be greater than 0 wei");

        require(
            nftFactory.detailNFT(_tokenId).owner == msg.sender,
            "You do not own this token"
        );
        nftFactory.transfer(msg.sender, address(this), _tokenId);

        nftFactory.updateNFT(
            _tokenId,
            true,
            nftFactory.detailNFT(_tokenId).price,
            payable(msg.sender),
            payable(address(this)),
            true
        );

        AuctionInfo memory _auction = AuctionInfo(
            msg.sender,
            _tokenId,
            _initialPrice,
            address(0),
            _initialPrice,
            address(0),
            _startTime,
            _endTime,
            false,
            true,
            auction.length
        );
        auction.push(_auction);
    }

    function setFee(uint256 fee) public {
        require(msg.sender == owner, "use not admin");
        AUCTION_SERVICE_FEE_RATE = fee;
    }

    function joinAuction(uint256 _auctionId, uint256 _bid) public payable {
        AuctionInfo memory _auction = auction[_auctionId];
        // require(
        //     block.timestamp >= _auction.startTime,
        //     "Auction has not started yet"
        // );
        require(msg.value == _bid, "lack of money");
        require(_auction.completed == false, "Auction has already ended");
        require(_auction.active, "Auction is not active");

        uint256 _minBid = _auction.lastBidder == address(0)
            ? _auction.initialPrice
            : (_auction.lastBid * MINIMUM_BID_RATE) / 100;

        require(
            _minBid <= _bid,
            "Bid price must be greater than the minimum bid"
        );

        require(
            _auction.auctioneer != msg.sender,
            "can not bid on your own auction"
        );

        // nftFactory.transfer(address(this),msg.sender,_auction._tokenId);
        if (_auction.lastBidder != address(0) && msg.sender != _auction.lastBidder) {
            payable(_auction.lastBidder).transfer(_auction.lastBid);
        }

        if (auction[_auctionId].lastBidder == msg.sender){
            auction[_auctionId].lastBid += _bid;
        }else{
            auction[_auctionId].lastBid = _bid;
            auction[_auctionId].lastBidder = msg.sender;
            auction[_auctionId].previousBidder = _auction.lastBidder;
        }
         emit join(msg.sender,auction[_auctionId].lastBid,_auctionId);
       
    }

    function finishAuction(uint256 _auctionId)
        public
        onlyAuctioneer(_auctionId)
    {
        require(
            auction[_auctionId].completed == false,
            "Auction is already completed"
        );
        require(auction[_auctionId].active, "Auction is not active");

        nftFactory.transfer(
            address(this),
            auction[_auctionId].lastBidder,
            auction[_auctionId]._tokenId
        );
        require(
            auction[_auctionId].lastBidder !=  address(0),
            "Cannot finishAuction when no one join"
        );
        uint256 lastBid = auction[_auctionId].lastBid;
        uint256 profit = auction[_auctionId].lastBid -
            auction[_auctionId].initialPrice;
        uint256 auctionServiceFee = (profit * AUCTION_SERVICE_FEE_RATE) / 100;
        uint256 auctioneerReceive = lastBid - auctionServiceFee;

        uint256 Fee = (profit * nftFactory.detailNFT(auction[_auctionId]._tokenId).royalties)/100;
        auctioneerReceive = auctioneerReceive - Fee;

        payable(auction[_auctionId].auctioneer).transfer(auctioneerReceive);
        payable(nftFactory.detailNFT(auction[_auctionId]._tokenId).author).transfer(Fee);

        nftFactory.updateNFT(
            auction[_auctionId]._tokenId,
            true,
            lastBid,
            payable(address(0)),
            payable(auction[_auctionId].lastBidder),
            false
        );

        auction[_auctionId].completed = true;
        auction[_auctionId].active = false;
    }

    function cancleAuction(uint256 _auctionId)
        public
        onlyAuctioneer(_auctionId)
    {
        require(
            auction[_auctionId].completed == false,
            "Auction is already completed"
        );
        require(auction[_auctionId].active, "Auction is not active");
        nftFactory.transfer(
            address(this),
            auction[_auctionId].auctioneer,
            auction[_auctionId]._tokenId
        );

        if (auction[_auctionId].lastBidder != address(0)) {
            payable(auction[_auctionId].lastBidder).transfer(
                auction[_auctionId].lastBid
            );
        }

        nftFactory.updateNFT(
            auction[_auctionId]._tokenId,
            true,
            nftFactory.detailNFT(auction[_auctionId]._tokenId).price,
            payable(address(0)),
            payable(auction[_auctionId].auctioneer),
            false
        );

        auction[_auctionId].completed = true;
        auction[_auctionId].active = false;
    }

    function getAuction(uint256 _auctionId)
        public
        view
        returns (AuctionInfo memory)
    {
        return auction[_auctionId];
    }

    function getAuctionByStatus(bool _active)
        public
        view
        returns (AuctionInfo[] memory)
    {
        uint256 length = 0;
        for (uint256 i = 0; i < auction.length; i++) {
            if (auction[i].active == _active) {
                length++;
            }
        }

        AuctionInfo[] memory results = new AuctionInfo[](length);
        uint256 j = 0;
        for (uint256 i = 0; i < auction.length; i++) {
            if (auction[i].active == _active) {
                results[j] = auction[i];
                j++;
            }
        }
        return results;
    }

    modifier onlyAuctioneer(uint256 _auctionId) {
        require(
            (msg.sender == auction[_auctionId].auctioneer ||
                msg.sender == owner),
            "Only auctioneer can cancel auction"
        );
        _;
    }
}
