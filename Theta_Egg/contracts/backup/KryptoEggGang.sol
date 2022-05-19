// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract KryptoEggGang is ERC721, Ownable {
    using SafeMath for uint256;
    // using SafeMath32 for uint32;
    // using SafeMath16 for uint16;

    uint256 public hatchTime = 360 days;
    uint256 public HatchTime;
    uint256 public tokenCounter;
    string public eggImageURI;
    string private hatchImageURI;
    uint256 public hatchFee = 0; // for presentation

    mapping(uint256 => uint256) public tokenIdToHatchTimer;

    event LaidEggNFT(uint256 indexed tokenId, uint256 indexed HatchTime);
    // test
    event HatchedEggNFT(uint256 indexed tokenId, uint256 indexed HatchedTime);

    constructor() public ERC721("Krypto Egg Gang", "KEG") {
        tokenCounter = 0;
    }

    function addEggURI(string memory _svgEggURI) public onlyOwner {
        eggImageURI = _svgEggURI;
    }

    function addHatchURI(string memory _svgHatchURI) public onlyOwner {
        hatchImageURI = _svgHatchURI;
    }

    function addEggSVG(string memory _svgEggRaw) public onlyOwner {
        string memory svgURI = svgToImageURI(_svgEggRaw);
        addEggURI(svgURI);
    }

    function addHatchSVG(string memory _svgHatchRaw) public onlyOwner {
        string memory svgURI = svgToImageURI(_svgHatchRaw);
        addHatchURI(svgURI);
    }

    function withdraw() external onlyOwner {
        address _owner = owner();
        payable(_owner).transfer(address(this).balance);
    }

    function setHatchFee(uint256 _fee) external onlyOwner {
        hatchFee = _fee;
    }

    // possibly delete for production version
    function ResetTimer(uint256 tokenId) external {
        // onlyOwner disabled for presentation
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        tokenIdToHatchTimer[tokenId] = (block.timestamp + hatchTime);
    }

    // prevented double paying -- possibly edit for future evo in v2
    function hatchEgg(uint256 tokenId) external payable {
        require(
            tokenIdToHatchTimer[tokenId] != (0),
            "You already hatched your egg"
        );
        require(
            block.timestamp <= tokenIdToHatchTimer[tokenId],
            "Your egg has already naturally hatched"
        );
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        // require( // disable for presentation
        //     msg.sender == ownerOf(tokenId),
        //     "Owner does not own this token"
        // );
        require(msg.value == hatchFee);
        tokenIdToHatchTimer[tokenId] = (0);
        emit HatchedEggNFT(tokenId, block.timestamp);
    }

    // might incorperate this function -- prossibly remove for production
    function bless(uint256 tokenId) external onlyOwner {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        tokenIdToHatchTimer[tokenId] = (0);
        emit HatchedEggNFT(tokenId, block.timestamp);
    }

    function create() public {
        tokenIdToHatchTimer[tokenCounter] = (block.timestamp + hatchTime);
        HatchTime = tokenIdToHatchTimer[tokenCounter];
        emit LaidEggNFT(tokenCounter, HatchTime);
        _safeMint(msg.sender, tokenCounter);
        tokenCounter = tokenCounter + 1;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }

    // possibly a better way
    function ownerOfTokenIds(address tokenOwner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](balanceOf(tokenOwner));
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == tokenOwner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // possibly add a view function that retuns all address's of token owners

    function ownerOfTokenURIs(address tokenOwner)
        external
        view
        returns (string[] memory)
    {
        string[] memory result = new string[](balanceOf(tokenOwner));
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == tokenOwner) {
                result[counter] = tokenURI(i);
                counter++;
            }
        }
        return result;
    }

    function allTokenTokenURIs() external view returns (string[] memory) {
        string[] memory result = new string[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            result[i] = tokenURI(i);
        }
        return result;
    }

    function allTokenArray() external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            result[i] = i;
        }
        return result;
    }

    // You could also just upload the raw SVG and have solildity convert it!
    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        // example:
        // '<svg width="500" height="500" viewBox="0 0 285 350" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M150,0,L75,200,L225,200,Z"></path></svg>'
        // would return ""
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
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
        string memory imageURI = eggImageURI;
        if (block.timestamp >= tokenIdToHatchTimer[tokenId]) {
            imageURI = hatchImageURI;
        }
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "Haching eggs NFT", // You can add whatever name here
                                '", "description":"An NFT that that hatches", "attributes":"", "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
