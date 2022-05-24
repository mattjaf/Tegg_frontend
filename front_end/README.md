# Tegg_frontend

## current things being worked on:

1. exporting the on-chain NFTs to another chain
    -possibly using unstoppable domain names to mask the data URL or masking the redirect that makes function call to the on-chain storage

    "[polygon]" --> _function call_ on HTML page uploaded to IPFS --> masked with a UD --> reminted on "[ethereum]"

    then having the user to send an

2. changing the name to Krypto Egg Gang
    - changing the banner and adding NFTs


3. fixing the smart contract
    - **known issue** the URI's might need a maping
        --what if the transaction fails while its minting...
    - adding a struct for meta data 

4. adding an error to tell the user to change networks

5. incorperating moralis
    - [react-moralis](https://github.com/MoralisWeb3/react-moralis)

6. incorperating chainlink such as a modular oracle background

7. deploying to fleek

8. write more test
    - hardhat tests
    - converage
    - echidna
    - slither


Please incorperate some cool stuff

## optional :

1. Having multiple wallets possibly using web3Modals or using ethereum boiler plate -- moralis seems ideal
    **issue: is theta wallet even web3 compatible?**

helpful links:

[ethereum boilerplate](https://github.com/mattjaf/ethereum-boilerplate)

[web3 react](https://github.com/mattjaf/web3-react)

[web3modal](https://github.com/mattjaf/web3modal)

[thetajs](https://docs.thetatoken.org/docs/theta-js-sdk-getting-started)

[theta-wallet-connect](https://docs.thetatoken.org/docs/browser-extension-wallet-developer-guide)

Things that might helpful:

ethers

web3reactProvider from @web3-react/core

web3provider from @ethersproject/providers (minimalversion of ethers)

to wrap all the code so the pages know the state of the providers





