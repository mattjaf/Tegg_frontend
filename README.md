# Quick start Notes

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)
In order, to start yarn on the front_end you might have to change ```"start": "node server.js",``` in the package.JSON under scripts to ```"start": "react-scripts start",```

# Tegg_frontend

## current things being worked on:

### please refer to the readme on the front_end

## Requirements


- [NPM](https://www.npmjs.com/) and/or [YARN](https://yarnpkg.com/)

## Installation
install all the dependencies

```bash
git clone https://github.com/mattjaf/ThetaEggNft

cd front_end
```
then

```bash
npm install
```

## Starting
![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)
Inorder, to start yarn on the front_end you might have to change ```"start": "node server.js",``` in the package.JSon under scripts to ```"start": "react-scripts start",```
```bash
cd front_end
```

```bash
yarn start
```

# theta_egg

## Requirements

- [NPM](https://www.npmjs.com/) and/or [YARN](https://yarnpkg.com/)

## Installation
install all the dependencies

```bash
cd theta_egg
```
then

```bash
yarn
```

## Deploy

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)


The most updated contract is KryproEggGang.sol
KyrptoEggGang2 is designed for Cross chain minting

For local testing
```bash
npx hardhat deploy --tags KEG
```
For deploying KryproEggGang.sol (it works it just takes a while sometimes)
```bash
npx hardhat deploy --tags KEG --network mumbai
```
For deploying KyrptoEggGang2.sol
```bash 
npx hardhat deploy --tags rinkeby --network rinkeby
```




## Notes

    deployed contracts are in the /backup and the deployments are in the front_end/src/abi

    - The transaction on polygon-mumbai got stuck when the gasLimit was set to 19 and 20 mill

    - polygon-mumbai was able to deploy setting the gasLimit to 18 mill later in the day
        - possibly due to the network being busy?

    - how to prevent transactions from failing?
        - is there a way to insure success, possibly increasing gasPrice?





