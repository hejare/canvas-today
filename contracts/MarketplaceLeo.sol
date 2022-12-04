// SPDX-License-Identifier: Unlicensed
//pragma solidity 0.8.4;
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

// NOTE:
// The problem with current code in this contract is that
// it sends the artworkContract to buyer. Keeping a count
// on this item makes no sense... Need to move similar
// logics insode the Artwork contract.

contract MarketplaceLeo {
  uint256 public itemCounter;
  address payable owner;
  uint256 public listingPrice;

  struct MarketItem {
    uint256 itemId;
    address nftContractAddress;
    uint256 tokenId;
    address payable seller;
    address owner;
    uint256 price;
    bool isSold;
    bool isPresent;
    uint256 count;
    uint256 maxCount;
  }

  mapping(uint256 => MarketItem) private marketItems;

  event MarketItemListed(
    uint256 indexed itemId,
    address indexed nftContractAddress,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    uint256 maxCount
  );

  constructor() {
    itemCounter = 0;
    owner = payable(msg.sender);
    listingPrice = 0.01 ether;
  }

  function listMarketItem(
    address nftContractAddress,
    uint256 tokenId,
    uint256 maxCount,
    uint256 price
  ) public payable {
    require(msg.value == listingPrice, "Must pay the listing price");
    require(price > 0, "Price must be greater than 0");
    require(maxCount > 0, "maxCount must be greater than 0");

    marketItems[itemCounter] = MarketItem(
      itemCounter,
      nftContractAddress,
      tokenId,
      payable(msg.sender),
      address(0),
      price,
      false,
      true,
      0,
      maxCount
    );

    IERC721(nftContractAddress).transferFrom(
      msg.sender,
      address(this),
      tokenId
    );

    payable(owner).transfer(listingPrice);

    emit MarketItemListed(
      itemCounter,
      nftContractAddress,
      tokenId,
      msg.sender,
      address(0),
      price,
      maxCount
    );

    itemCounter += 1;
  }

  function buyMarketItem(uint256 itemId) public payable {
    require(marketItems[itemId].isPresent, "Item is not present");
    require(marketItems[itemId].isSold == false, "Item is already sold out");
    require(
      marketItems[itemId].price == msg.value,
      "Must pay the correct price"
    );

    marketItems[itemId].count = marketItems[itemId].count + 1;
    marketItems[itemId].isSold =
      marketItems[itemId].count == marketItems[itemId].maxCount;
    marketItems[itemId].owner = payable(msg.sender);

    IERC721(marketItems[itemId].nftContractAddress).transferFrom(
      address(this),
      msg.sender,
      marketItems[itemId].tokenId
    );
    console.log("NFT with itemId ", itemId, "is sold to ", msg.sender);
  }

  function getMarketItem(
    uint256 itemId
  ) public view returns (MarketItem memory items) {
    items = marketItems[itemId];
  }

  function changeListingPrice(uint256 newPrice) public {
    require(newPrice > 0, "Listing Price must be greater than 0");
    require(msg.sender == owner, "Only the owner can change the listing price");

    listingPrice = newPrice;
  }
}
