// SPDX-License-Identifier: MIT
// Curr addr as owner: 0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766

// Last deploy contract address: 0x7Fb820fb86388443Bcb6219dD94A7F3C58E59064
// TX: 0xf206c569e8a861b506d69bc6714147d89091b1f2c26680ed5169dfab69139493
// Tx Fee: 0.061424086049267008 ETH () 534680006795245935 -> 473255920745978927 = 61424086000000000 [i.e. actual total cost]
// Gas Price: 0.000000015410389366 ETH (15.410389366 Gwei)
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
Get artCounts like this:
const count = await storage.artsCount(); // returns a BigNumber obj
console.log("COUNT:", count.toNumber())
*/

contract NFT is ERC721, PullPayment, Ownable {
  uint8 public constant TOTAL_SUPPLY = 5; // TODO. Can we move this to .env somehow? (NFT_TOTAL_SUPPLY_PER_CANVAS)
  // uint8 public constant MINT_PRICE = 100 Gwei; //0.08 ether; // TODO: Think this though...

  address payable wallet; // incoming funds passed here. Set durin gdeployment

  constructor(address payable _wallet) ERC721("Canvas Today", "NFT") {
    wallet = _wallet;
  }

  event Minted(
    address indexed _buyer,
    uint256 indexed _artId,
    uint256 _nrOfItems
  );

  uint256 public artsCount = 0;
  mapping(uint64 => ArtStruct) private artMintedMapping;
  struct ArtStruct {
    uint64 artId;
    string metaUrl;
    uint8 counter;
    bool exists;
  }
  ArtStruct[] public Arts; // this, with artsCount, makes all arts accessable in combo with "getArt(artId)"

  function getArt(uint64 artId) public view virtual returns (ArtStruct memory) {
    return artMintedMapping[artId];
  }

  function addArt(uint64 artId, string memory metaUrl) public onlyOwner {
    require(!artMintedMapping[artId].exists, "Art already exist");
    artMintedMapping[artId].exists = true;
    artMintedMapping[artId].artId = artId; // to be able to fetch the accurate artMinted data
    artMintedMapping[artId].metaUrl = metaUrl;
    artMintedMapping[artId].counter = 0;
    Arts.push(artMintedMapping[artId]);
    artsCount += 1;
  }

  function mint(uint64 artId) public payable returns (uint256) {
    require(artMintedMapping[artId].exists, "Art does not exist");
    require(
      artMintedMapping[artId].counter < TOTAL_SUPPLY,
      "Max supply reached"
    );
    // require(
    //   msg.value == MINT_PRICE,
    //   "Transaction value did not equal the mint price"
    // );

    artMintedMapping[artId].counter += 1;
    uint256 tokenId = packTokenId(artId, artMintedMapping[artId].counter);

    //Open Zeppelin ERC721 _safeMint function
    _safeMint(msg.sender, tokenId);
    // Call this after? _asyncTransfer // If using this, I think we must pull the transfers "manually" when wanted.
    wallet.transfer(msg.value);
    emit Minted(msg.sender, artId, 1);

    return tokenId;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override
    returns (string memory)
  {
    (uint64 artId, uint8 counter) = unpackTokenId(tokenId);
    return artMintedMapping[artId].metaUrl;
  }

  function packTokenId(uint64 artId, uint8 counter)
    public
    pure
    returns (uint256)
  {
    // What to fill out extra data for? SERVICEID? (like CanvasToday is one ID), DAYS|VARIANT|?
    // ARTID|COUNTER -> uint64|8bit -> 72bit
    return uint256((uint72(artId) << 64) | uint8(counter));
  }

  function unpackTokenId(uint256 c) public pure returns (uint64 a, uint8 b) {
    a = uint64(c >> 64);
    b = uint8(c);
  }

  /// @dev Overridden in order to make it an onlyOwner function
  // function withdrawPayments(address payable payee)
  //   public
  //   virtual
  //   override
  //   onlyOwner
  // {
  //   super.withdrawPayments(payee);
  // }
}
