import React, { Component } from "react";
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
      error: null,
      hatchTimestamps: [],
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
    this.setState({ contract });
    console.log(this.state.contract);

    const web3 = window.web3;
    const accounts = await web3.eth.requestAccounts();
    this.setState({ account: accounts[0] });
    console.log(this.state.account);

    // call the total supply of our NFTs
    try {
      const totalSupply = await contract.methods.totalSupply().call();
      const teggNFTUrls = []
      for (let i = 1; i <= totalSupply; i++) {
        teggNFTUrls.push(await contract.methods.tokenURI(i - 1).call())

      }
      const teggNFTs = await Promise.all(teggNFTUrls.map((url) => axios.get(url)));
      // Hatch timestamps in BigNumber
      const hatchBigNumberTimestamps =
        await Promise.all(teggNFTUrls.map((_, index) => this.state.contract.methods.tokenIdToHatchTimer(index).call()))
      this.setState({
        teggNFTs,
        // Convert BigNumbers to numbers and then to milliseconds
        hatchTimestamps: hatchBigNumberTimestamps.map(Number).map((num) => num * 1000)
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    return (
      <div className="app-container">
        <HeaderSection account={this.state.account} />
        <div className="app-content">
          {this.state.error && (
            <div className="error-container">
              <p>Ran into an error!</p>
              <p>{JSON.stringify(this.state.error)}</p>
            </div>
          )}
          {this.state.teggNFTs.length === 0 && !this.state.error && (
            <h1 style={{ padding: '30px', textAlign: 'center' }}>Loading your NFTs!</h1>
          )}
          {this.state.teggNFTs.map((teggNFT, key) => {
            return (
              <div className="nft-card" key={`teggNFT.data.name_${key}`}>
                <EggCard contractMethods={this.state.contract.methods}
                  nft={teggNFT}
                  hatchTimestamp={this.state.hatchTimestamps[key]}
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
