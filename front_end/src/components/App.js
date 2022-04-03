import React, { Component, component } from "react";
import Web3 from "web3";
import detectEtherumProvider from "@metamask/detect-provider";
import TeggNFT from "../abi/TeggNFTTheta.json"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import './App.css';
import axios from 'axios';


class App extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEtherumProvider();

    // modern browsers
    // if tgere is a provider then lets
    // lets log that its working from the doc
    // to set Web3 to the provider

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
    this.setState({ account: accounts[0] })
    console.log(this.state.account)

    // create a constant js variable networkId which is set to the blockchain nettowrkId
    const networkId = await web3.eth.net.getId()
    const networkData = TeggNFT //.networks[networkId]
    if (networkData) {
      const abi = TeggNFT.abi;
      const address = TeggNFT.address;
      const contract = new web3.eth.Contract(abi, address)
      this.contract = contract;
      this.setState({ contract });
      console.log(this.state.contract);

      // call the total supply of our NFTs
      //grab the total supply on the front end and log the results
      // go to web3 doc and read up on methods and call

      const teggNFTs = await contract.methods.allTokenTokenURIs().call()

      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      console.log(this.state.totalSupply)
      //set up an array to keep track of tokens
      for (let i = 1; i <= totalSupply; i++) { //this is listing an array of minted tokens
        const TeggNFT = await axios.get(teggNFTs[i - 1])
        // how should we handle the state on the front end
        this.setState({
          teggNFTs: [...this.state.teggNFTs, TeggNFT] // spread operator
        }) // pretty sure the array could be done on the front end

      }
      // const meta = await axios.get(teggNFTs[0])
      console.log(this.state.teggNFTs)
      // console.log(meta.data.image)

    } else {
      window.alert('Smart contract not deployed')
    }
  }



  // with minting we are sending infromation and we need to specify the account
  /*
    mint = (kryptoBird) => {
      this.state.contract.methods.mint(kryptoBird).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          this.setState({
            kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird]
          })
        })
    }
  */
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      teggNFTz: [],
      teggNFTs: [],
      tokenURI: '',
      imageURI: '',
    }
  }

  render() {
    return (
      <div className="container-filled">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowwrap p-0 shadow">
          <div className="nav-brand col-sm-3 col-md-3 mr-0" style={{ color: 'black' }}>

            Theta Egg NFTs (Auto-hatching Tokens)
          </div>
          <ul className="navbar-nav px-3">
            <li className='nav-item text-nowrap
                    d-none d-sm-none d-sm-block
                    '>
              <small className="text-white">
                {this.state.account}
              </small>
            </li>
          </ul>
        </nav>

        <div className='container-fluid mt-1'>
          <div className="row">
            <main role='main'
              className="col-lg-12 d-flex text-center">
              <div className='content mr-auto ml-auto'
                style={{ opacity: '0.8' }}>
                <h1 style={{ color: 'white' }}>
                  Theta Hatchery</h1>

              </div>
            </main>
          </div>
          <hr></hr>
          <div className="row textCenter">
            {this.state.teggNFTs.map((teggNFT, key) => {
              { console.log(this.state.teggNFTs[0].image) }
              return (
                <div>
                  <div>

                    <MDBCard className="token img" style={{ maxWidth: '22rem' }}>
                      <MDBCardImage src={teggNFT.data.image} position='top' height='250rem' style={{ marginRight: '4px' }} />
                      <MDBCardBody>
                        <MDBCardTitle> Theta Eggs</MDBCardTitle>
                        <MDBCardText> These are automatic hatching theta eggs stored 100% on-chain. They will hatch in a year or for a small fee. </MDBCardText>
                        <MDBBtn onClick={() => {
                          console.warn(`using ${this.state.account}`);
                          this.state.contract.methods.hatchEgg(key).send({ from: this.state.account });
                        }} href={teggNFT.data.image}>Hatch</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </div>

              )

            })}

          </div>
        </div>
      </div>
    )
  }
}

export default App;
