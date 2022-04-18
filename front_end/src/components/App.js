import React, {Component} from "react";
import Web3 from "web3";
import detectEtherumProvider from "@metamask/detect-provider";
import ThetaEggThetaAbi from "../abi/TeggNFTTheta.json"
import './global.css';
import axios from 'axios';
import HeaderSection from "./HeaderSection";
import EggCard from "./EggCard";


class App extends Component {
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

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEtherumProvider();
    if (!provider) {
      console.error('No ethereum wallet detected.');
      return;
    }
    window.web3 = new Web3(provider);
    console.log('ethereum, wallet is connected')
  }

  async loadBlockchainData() {
    if (!ThetaEggThetaAbi) {
      console.error("Smart contract not deployed.");
      return;
    }

    const abi = ThetaEggThetaAbi.abi;
    const address = ThetaEggThetaAbi.address;
    const contract = new window.web3.eth.Contract(abi, address)
    this.setState({contract});
    console.log(this.state.contract);

    const web3 = window.web3;
    const accounts = await web3.eth.requestAccounts();
    this.setState({account: accounts[0]});
    console.log(this.state.account);

    // call the total supply of our NFTs
    //grab the total supply on the front end and log the results
    // go to web3 doc and read up on methods and call
    const teggNFTs = await contract.methods.ownerOfTokenURIs("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call();

    const balanceOf = await contract.methods.balanceOf("0xFc73F357Fb770845063dD42104A6F167fF3aE433").call();
    this.setState({balanceOf});
    //set up an array to keep track of tokens
    for (let i = 1; i <= balanceOf; i++) { //this is listing an array of minted tokens
      const teggNftResponse = await axios.get(teggNFTs[i - 1])
      // how should we handle the state on the front end
      this.setState({
        teggNFTs: [...this.state.teggNFTs, teggNftResponse] // spread operator
      }); // pretty sure the array could be done on the front end
    }
  }

  render() {
    return (
      <div className="app-container">
        <HeaderSection account={this.state.account}/>
        <div className="content">
          {this.state.teggNFTs.length === 0 && (
            <h1 style={{padding: '30px', textAlign: 'center'}}>Loading your NFTs!</h1>
          )}
          {this.state.teggNFTs.map((teggNFT, key) => {
            return (
              <div className="nft-card" key={`teggNFT.data.name_${key}`}>
                <EggCard contractMethods={this.state.contract.methods}
                         nft={teggNFT}
                         nftIndex={key}
                         account={this.state.account} />
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default App;
