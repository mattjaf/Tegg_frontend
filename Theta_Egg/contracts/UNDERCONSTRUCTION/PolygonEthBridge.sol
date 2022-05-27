// SPDX-License-Identifier: MIT

// UNDER CONSTRUCTION
/*
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract domainNameInterface {
    //function(s) to mint domain name and set/mask
    // for some reason the polygon-mumbai contract wouln't resolve even with IPFS hash
    // worked on polygon
    function claimToWithRecords(
        address to,
        uint256 tld,
        string calldata label,
        string[] calldata keys,
        string[] calldata values
    ) external override onlyAllowed(tld, label) whenNotPaused {
        _mintSLDWithRecords(to, tld, _freeSLDLabel(label), keys, values);
    }
}

   //error NotOwner();

 contract NFTBridge is ERC721, ReentrancyGuard {



    domainNameInterface domainNameContract;

    event BridgedToken(); //event logic
    event TokenCompiled(uint256 indexed tokenId, address indexed nftAddress, string indexed maskedTokenURI);

    constructor () {
        domainNameContract = domainNameInterface(0x4f4c3a4B75346A546d309934726e7FfbdA13262D);
    }

    function setDomainNameContract(address _address) external onlyOwner {
    domainNameContract = domainNameInterface(_address);

    function bridge(address nftAddress, uint256 tokenId) external payable isOwner(nftAddress, tokenId, msg.sender) returns(bool) {
        transfers NFT to contract, then cross chain sends NFT
        IERC721(nftAddress).safeTransferFrom(msg.sender, address(this), tokenId);
        return true; //front end listens for event then mints another token if one hasnt already been minted?
        //remints on the otherside with reference to original contract address and tokenId

 }

    function compile(address nftAddress, uint256 tokenId) public isOwner(nftAddress, tokenId, msg.sender) {
        _tokenURI = IERC721(nftAddress).tokenURI(tokenId);
        //function call that mints a domain name and masks _tokenURI
        emit tokenCompiled(tokenId, nftAddress, maskedTokenURI)

  }

modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address spender
  ) {
    IERC721 nft = IERC721(nftAddress);
  address owner = nft.ownerOf(tokenId);
if (spender != owner) {
  revert NotOwner();
}
_;
  }

}
*/