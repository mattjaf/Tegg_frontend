# Tegg_frontend

## current things being worked on:

1. fixing the countdown timer to display on all the tokens with the data associated with the tokenId
```
mapping(uint256 => uint256) public tokenIdToHatchTimer;
```


2. Solution to tokenId 0's hatch function breaking the site with the suspected large URI

possible solution: sending the token to another address and displaying the tokens from the wallet of the token owner
    
    -The key maps to the index [0,1,2] when the tokenId are [1,2,3]
        -TEMPORARY FIX: (key+1)
            **issue: if the owner has tokenIds that are not in sequential order, it will break**

proper fix IMO
```
const keys = await this.setState.contract.methods.ownerOfTokenIds("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call()
```
 then setting the function to the key elements
 ```
 keys[key]
 ```
    **issue: keys is not defined**


3. possibly have an alert or some form of prompt that pops up that makes sure the user connects to theta testnet

4. pushing it to Digital Ocean


Please incorperate some cool stuff

## optional :

1. Having multiple wallets possibly using web3Modals or using ethereum boiler plate
    **issue: is theta wallet even web3 compatible?**

helpful links:

[ethereum boilerplate](https://github.com/mattjaf/ethereum-boilerplate)

[web3 react](https://github.com/mattjaf/web3-react)

[web3modal](https://github.com/mattjaf/web3modal)

[thetajs](https://docs.thetatoken.org/docs/theta-js-sdk-getting-started)

[theta-wallet-connect](https://docs.thetatoken.org/docs/browser-extension-wallet-developer-guide)

Things that might help:

ethers

web3reactProvider from @web3-react/core

web3provider from @ethersproject/providers (minimalversion of ethers)

to wrap all the code so the pages know the state of the providers





