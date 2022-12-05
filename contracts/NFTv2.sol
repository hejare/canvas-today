// SPDX-License-Identifier: MIT
// Curr addr as owner: 0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766

// Last deploy contract address: 0x099F3719A1BF3f43c2D72531E770f061342eEbcd
// TX:
// Tx Fee:
// Gas Price:
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NFTv2 is ERC721, PullPayment, Ownable {
  using Counters for Counters.Counter;

  address payable wallet;
  Counters.Counter public tokenIds; // COULD PERHAPS BE REMOVED SINCE WE DONT CARE ABOUT THIS...except _exists...

  mapping(uint256 => ArtNftStruct) ArtNfts;
  struct ArtNftStruct {
    uint256 artId;
    string metaUrl;
  }

  mapping(uint256 => ArtItemStruct) ArtItems;
  struct ArtItemStruct {
    uint8 counter;
    bool exists;
    string metaUrl;
    uint8 maxSupply;
    uint256 price;
  }

  uint256[] public artIds;

  // TODO: Check if not any of the default event emitted from ERC721 is usable...
  event Minted(
    address indexed _buyer,
    uint256 indexed _artId,
    uint256 indexed _tokenId
  );

  constructor(address payable _wallet) ERC721("Canvas Today", "NFT") {
    wallet = _wallet;
    console.log("constructor!");
  }

  function getArtIds() public view returns (uint256[] memory) {
    return artIds;
  }

  function addArt(
    uint256 artId,
    string memory metaUrl,
    uint8 maxSupply,
    uint256 price
  ) public onlyOwner {
    require(!ArtItems[artId].exists, "Art already exist");
    ArtItems[artId].exists = true;
    ArtItems[artId].counter = 0;
    ArtItems[artId].metaUrl = metaUrl;
    ArtItems[artId].maxSupply = maxSupply;
    ArtItems[artId].price = price;
    artIds.push(artId);

    console.log(
      "Add art done!",
      artIds.length,
      ArtItems[artId].maxSupply,
      price
    );
  }

  function getArt(uint256 artId) public view returns (ArtItemStruct memory) {
    require(ArtItems[artId].exists, "Art does not exist");
    return ArtItems[artId];
  }

  function setPrice(uint256 artId, uint256 _price) public onlyOwner {
    require(ArtItems[artId].exists, "Art does not exist");
    ArtItems[artId].price = _price;
  }

  function mint(uint256 artId) public payable {
    require(ArtItems[artId].exists, "Art does not exist");
    require(
      ArtItems[artId].counter < ArtItems[artId].maxSupply,
      "Max supply reached"
    );
    require(
      msg.value >= ArtItems[artId].price,
      "Not enough ETH sent, check price!"
    );

    uint256 newTokenId = tokenIds.current();

    ArtNftStruct memory NewArtNft;
    NewArtNft.artId = artId;
    NewArtNft.metaUrl = ArtItems[artId].metaUrl;

    _safeMint(msg.sender, newTokenId);

    ArtItems[artId].counter += 1;
    ArtNfts[newTokenId] = NewArtNft;

    wallet.transfer(msg.value);
    emit Minted(msg.sender, artId, newTokenId);
    console.log("[Art minted] msg.ender, artId:", msg.sender, artId);
    console.log("[Art minted] msg.value, newTokenId:", msg.value, newTokenId);

    tokenIds.increment();
  }

  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    return ArtNfts[tokenId].metaUrl;
  }
}
