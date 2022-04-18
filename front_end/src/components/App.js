import React, {Component} from "react";
import Web3 from "web3";
import detectEtherumProvider from "@metamask/detect-provider";
import TeggNFT from "../abi/TeggNFTTheta.json"
import './global.css';
import axios from 'axios';
import HeaderSection from "./HeaderSection";
import EggCard from "./EggCard";


class App extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEtherumProvider();
    //const chainId = thetajs.networks.ChainIds.Testnet;
    // const provider = new thetajs.providers.HttpProvider();

    if (provider) {
      console.log('ethereum, wallet is connected')
      window.web3 = new Web3(provider)
    } else {
      // no ethereum provider
      console.log('no ethereum wallet detected')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.requestAccounts();
    this.setState({account: accounts[0]})
    console.log(this.state.account)

    if (!TeggNFT) {
      console.error("Smart contract not deployed.");
      return;
    }

    const abi = TeggNFT.abi;
    const address = TeggNFT.address;
    const contract = new web3.eth.Contract(abi, address)
    // const provider = new thetajs.providers.HttpProvider();
    // const contract = new thetajs.Contract(address, abi, provider);
    this.setState({contract});
    console.log(this.state.contract);
    // const signer = contract.connect(wallet);

    // call the total supply of our NFTs
    //grab the total supply on the front end and log the results
    // go to web3 doc and read up on methods and call

    const teggNFTs = await contract.methods.ownerOfTokenURIs("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call()

    const balanceOf = await contract.methods.balanceOf("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call()
    this.setState({balanceOf})
    //set up an array to keep track of tokens
    for (let i = 1; i <= balanceOf; i++) { //this is listing an array of minted tokens
      const TeggNFT = await axios.get(teggNFTs[i - 1])
      // how should we handle the state on the front end
      this.setState({
        teggNFTs: [...this.state.teggNFTs, TeggNFT] // spread operator
      }) // pretty sure the array could be done on the front end
    }
  }


  // const keys = await this.setState.contract.methods.ownerOfTokenIds("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call();
  // with minting we are sending infromation and we need to specify the account

  // hatchEggNFT = (i) => {
  //  this.state.contract.methods.hatchEggNFT(i).send({ from: this.state.account })
  //    .once('receipt', (receipt) => {
  //      this.setState({
  //        teggNFTs: [...this.state.teggNFTs, TeggNFT]
  //      })
  //    })
  //}
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      teggNFTs: [],
      tokenURI: '',
      imageURI: '',
      balanceOf: 0,
      keys: [],

    }
  }

  render() {
    return (
      <div className="app-container">
        <HeaderSection account={this.state.account}/>
        <div className="content">
          {this.state.teggNFTs.map((teggNFT, key) => {
            return (
              <div className="nft-card" key={`teggNFT.data.name_${key}`}>
                <EggCard contractMethods={this.state.contract.methods} nft={teggNFT} nftIndex={key} />
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default App;
