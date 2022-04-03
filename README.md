# Tegg_frontend

## current things being worked on:

1. Getting the imageURI to display in the MDB card.


2. change download button to hatch button
```
hatchEgg(uint256 tokenId)
```


3. possibly put a countdown on the cards to show when the egg will hatch,
from the 
```
mapping(uint256 => uint256) public tokenIdToHatchTimer;
```


## optional :

1. figure out how to get an array of tokens owned by user in an efficent way and map them to the image from their tokenURI

    -most likely done on the front end...

    -possibly from a view function in solidity, such as a working version of something like.

```     
function ownerOfTokenIds(address tokenOwner) external view returns (uint256[] memory) {
        uint256[] memory result;// = new uint256[](_holderTokens[tokenOwner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == tokenOwner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
```

