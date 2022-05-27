// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "base64-sol/base64.sol";

contract KryptoEggGang2 is ERC721, Ownable {
    using SafeMath for uint256;
    // using SafeMath32 for uint32;
    // using SafeMath16 for uint16;

    uint256 public hatchTime = 360 days; /*notInUse*/
    uint256 public tokenCounter;

    mapping(uint256 => uint256) public tokenIdToHatchTimer; /*notInUse*/
    mapping(uint256 => string) public tokenIdToImageURI;

    constructor() public ERC721("Krypto Egg Gang", "KEG") {
        tokenCounter = 0;
    }

    function withdraw() external onlyOwner {
        address _owner = owner();
        payable(_owner).transfer(address(this).balance);
    }

    function ResetTimer(uint256 tokenId) external {
        /*notInUse*/
    }

    function hatchEgg(uint256 tokenId) external payable {
        /*notInUse*/
    }

    function create(string memory _URI) public {
        tokenIdToHatchTimer[tokenCounter] = (block.timestamp + hatchTime);
        _safeMint(msg.sender, tokenCounter);
        tokenIdToImageURI[tokenCounter] = _URI;
        //_setTokenURI(tokenCounter, _URI);
        tokenCounter = tokenCounter + 1;
    }

    // possibly add individual metadata attributed to tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "Krypto Egg Gang", // You can add whatever name here
                                '", "description":"An NFT that that hatches", "attributes":"", "image":"',
                                tokenIdToImageURI[tokenId],
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
