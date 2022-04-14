import React, { Component, component } from "react";
import Web3 from "web3";
import detectEtherumProvider from "@metamask/detect-provider";
import TeggNFT from "../abi/TeggNFTTheta.json"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import './App.css';
import axios from 'axios';
// import './banner2.jpg';
import ThetaWalletConnect from "@thetalabs/theta-wallet-connect";
import * as thetajs from "@thetalabs/theta-js";


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
    //const accounts = await ThetaWalletConnect.requestAccounts();
    this.setState({ account: accounts[0] })
    console.log(this.state.account)

    // create a constant js variable networkId which is set to the blockchain nettowrkId
    const networkId = await web3.eth.net.getId()
    const networkData = TeggNFT //.networks[networkId]
    if (networkData) {
      const abi = TeggNFT.abi;
      const address = TeggNFT.address;
      const contract = new web3.eth.Contract(abi, address)
      // const provider = new thetajs.providers.HttpProvider();
      // const contract = new thetajs.Contract(address, abi, provider);
      this.contract = contract;
      this.setState({ contract });
      console.log(this.state.contract);
      // const signer = contract.connect(wallet);

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

    var yourDateToGo = new Date(); //here you're making new Date object
    var now = Math.round((new Date()).getTime() / 1000);
    var rem = (((await this.state.contract.methods.tokenIdToHatchTimer(0 /*key*/).call() - now) / 86400));
    yourDateToGo.setDate(yourDateToGo.getDate() + rem); //your're setting date in this object 1 day more from now

    //you can change number of days to go by putting any number in place of 1

    var timing = setInterval( // you're making an interval - a thing, that is updating content after number of miliseconds, that you're writing after comma as second parameter
      function () {

        var currentDate = new Date().getTime(); //same thing as above
        var timeLeft = yourDateToGo - currentDate; //difference between time you set and now in miliseconds



        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)); //conversion miliseconds on days 
        if (days < 10) days = "0" + days; //if number of days is below 10, programm is writing "0" before 9, that's why you see "09" instead of "9"
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); //conversion miliseconds on hours
        if (hours < 10) hours = "0" + hours;
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); //conversion miliseconds on minutes 
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);//conversion miliseconds on seconds
        if (seconds < 10) seconds = "0" + seconds;
        // 1680856964
        // 1649784856
        //31026345
        document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s"; // putting number of days, hours, minutes and seconds in div, 
        //which id is countdown

        if (timeLeft <= 0) {
          clearInterval(timing);
          document.getElementById("countdown").innerHTML = "Hatched"; //if there's no time left, programm in this 2 lines is clearing interval (nothing is counting now) 
          //and you see "It's over" instead of time left
        }
      }, 1000);


  }




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
    }
  }

  render() {
    return (
      <div className="container-filled">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowwrap p-0 shadow">
          <div className="nav-brand col-sm-3 col-md-3 mr-0" style={{ color: 'black' }}>

            Theta Egg NFTs (Automatic hatching Tokens!)
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

                  <div classname="img-container" position='center'>
                    <img className="banner-img" alt="." src={'banner2.jpg'} size='100%' />
                  </div>
                  Please make sure you have metamask on the Theta Test network.
                </h1>
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
                      <MDBCardTitle className="row justify-content-center border rounded-pill" id="countdown" ></MDBCardTitle>
                      <MDBCardImage src={teggNFT.data.image} position='top' height='250rem' style={{ marginRight: '4px' }} />
                      <MDBCardBody>
                        <MDBCardTitle> Theta Eggs</MDBCardTitle>
                        <MDBCardText> These are automatic hatching theta eggs stored 100% on-chain. They will hatch in a year or for a small fee. </MDBCardText>
                        <MDBBtn onClick={() => {
                          console.warn(`using ${this.state.account}`);
                          this.state.contract.methods.hatchEgg(key).send({ from: this.state.account });
                        }} >Hatch</MDBBtn>
                        <MDBBtn onClick={() => {
                          console.warn(`using ${this.state.account}`);
                          this.state.contract.methods.ResetTimer(key).send({ from: this.state.account });
                        }}>Reset test</MDBBtn>
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
