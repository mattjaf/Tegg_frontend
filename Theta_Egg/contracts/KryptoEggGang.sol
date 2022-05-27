// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__UpkeepNotNeeded();
error NFT__AlreadyHatched();
error NFT__AlreadyHatchedNaturally();
error NFT__DoesNotExist();
error NFT__NotEnoughFunds();
error Raffle__TransferFailed();

contract KryptoEggGang3 is
    ERC721,
    VRFConsumerBaseV2,
    KeeperCompatibleInterface,
    Ownable
{
    using SafeMath for uint256;
    // using SafeMath32 for uint32;
    // using SafeMath16 for uint16;

    // NFT Variables
    uint256 public hatchTime = 360 days;
    uint256 public HatchTime; // do i really need this?
    uint256 public tokenCounter;
    uint256 public hatchFee = 0; // for presentation
    /* State variables */
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    // Upkeep Variables
    uint256 private immutable i_interval;
    uint256 private s_lastTimeStamp;
    address private s_recentWinner;

    mapping(uint256 => uint256) public tokenIdToHatchTimer;
    mapping(uint256 => EggMetadata) public tokenIdToEggMetadata;
    mapping(uint256 => HatchMetadata) private tokenIdToHatchMetadata;

    struct EggMetadata {
        // pulls data from generative art
        string name;
        string discription;
        string attributes;
        string imageURI;
    }
    struct HatchMetadata {
        // pulls data from generative art
        string name;
        string discription;
        string attributes;
        string imageURI;
    }

    event LaidEggNFT(uint256 indexed tokenId, uint256 indexed HatchTime);
    event HatchedEggNFT(uint256 indexed tokenId, uint256 indexed HatchedTime);
    // could have an automatic VRF air drop for hatched egg owners
    // or something awesome for them
    event RequestedRandomWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed player); // uint256 indexed tokenId

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Krypto Egg Gang", "KEG") {
        tokenCounter = 0;
        // VRF
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        // Upkeep
        i_interval = interval;
        s_lastTimeStamp = block.timestamp;
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        //change to hantched egg's in the future
        address[] memory result = new address[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            result[i] = ownerOf(i);
        }
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = result.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0"); // I guess i'll find out
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded();
        }
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        // NO
        emit RequestedRandomWinner(requestId);
    }

    // possibly reduce the complexity of this single function
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // maybe seperate some of these computations
        address[] memory players = new address[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            players[i] = ownerOf(i);
        }
        uint256 indexOfWinner = randomWords[0] % players.length;
        address recentWinner = players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_lastTimeStamp = block.timestamp;
        uint256[] memory result = new uint256[](balanceOf(recentWinner));
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == recentWinner) {
                result[counter] = i;
                counter++;
            }
        }
        // hatch the first one that isnt hatched
        for (uint256 i = 0; i < result.length; i++) {
            if (tokenIdToHatchTimer[result[i]] != 0) {
                bless(result[i]);
                break;
            }
        }
        emit WinnerPicked(recentWinner); // could add the tokenId and display it on the front_end
    }

    function addEggURI(string memory _svgEggURI) public onlyOwner {
        tokenIdToEggMetadata[tokenCounter].imageURI = _svgEggURI;
    }

    function addHatchURI(string memory _svgHatchURI) public onlyOwner {
        tokenIdToHatchMetadata[tokenCounter].imageURI = _svgHatchURI;
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
        if (!_exists(tokenId)) {
            revert NFT__DoesNotExist();
        }
        tokenIdToHatchTimer[tokenId] = (block.timestamp + hatchTime);
    }

    // prevented double paying -- possibly edit for future evo in v2
    function hatchEgg(uint256 tokenId) external payable {
        if (tokenIdToHatchTimer[tokenId] == (0)) {
            revert NFT__AlreadyHatched();
        }
        if (block.timestamp >= tokenIdToHatchTimer[tokenId]) {
            revert NFT__AlreadyHatchedNaturally();
        }
        if (!_exists(tokenId)) {
            revert NFT__DoesNotExist();
        }
        // require( // disable for presentation
        //     msg.sender == ownerOf(tokenId),
        //     "Owner does not own this token"
        // );
        if (msg.value != hatchFee) {
            revert NFT__NotEnoughFunds();
        }
        tokenIdToHatchTimer[tokenId] = (0);
        emit HatchedEggNFT(tokenId, block.timestamp);
    }

    // might incorperate this function -- prossibly remove for production
    function bless(uint256 tokenId) internal {
        // onlyOwner
        // if (!_exists(tokenId)) {
        //    revert NFT__DoesNotExist();
        // }
        tokenIdToHatchTimer[tokenId] = (0);
        emit HatchedEggNFT(tokenId, block.timestamp);
    }

    function create() public {
        tokenIdToHatchTimer[tokenCounter] = (block.timestamp + hatchTime);
        HatchTime = tokenIdToHatchTimer[tokenCounter];
        _safeMint(msg.sender, tokenCounter);
        emit LaidEggNFT(tokenCounter, HatchTime);
        tokenCounter = tokenCounter + 1;
    }

    // could get an array of token owner for an automatic air drop using VRF and keepers
    function allTokenOwners() external view returns (address[] memory) {
        address[] memory result = new address[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            result[i] = ownerOf(i);
        }
        return result;
    }

    // possibly a better way
    //subject to be removed this stuff could be done on the fronend
    // might add one for returning address of the token owner for possible airdrop raffle
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
        string memory imageURI = tokenIdToEggMetadata[tokenId].imageURI; //Metadata = tokenIdToEggMetadata[tokenId];
        if (block.timestamp >= tokenIdToHatchTimer[tokenId]) {
            imageURI = tokenIdToHatchMetadata[tokenId].imageURI; //Metadata = tokenIdToHatchMetadata[tokenId];
        }
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
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
