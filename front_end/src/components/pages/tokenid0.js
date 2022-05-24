import React, { Component } from "react";
import axios from 'axios';
import KryptoEggGangAbi from "../../abi/KryptoEggGang.json";
import '../global.css';
import { Moralis } from "moralis";


class Tokenid0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            nft: "",
            img: ""
        }
    }

    async componentDidMount() {
        await this.startMoralis();
    }

    async startMoralis() {
        const serverUrl = "https://sq1cosmtdu4e.usemoralis.com:2053/server";
        const appId = "hzxvpNx4hB30eoTun2ioSLbmJBdFtNbLZd306Chm";
        Moralis.start({ serverUrl, appId });

        const options = {
            chain: "mumbai",
            address: "0x4Be58979D6b8079800090b281879037288b9E1bc",
            function_name: "tokenURI",
            abi: KryptoEggGangAbi.abi,
            params: {
                tokenId: "0",
            },
        };

        var token = await Moralis.Web3API.native.runContractFunction(options)
        this.setState({ token })
        console.log(token)
        var nft = await axios.get(token)
        this.setState({ nft })
        console.log(nft)
        var img = await nft.data.image
        this.setState({ img })

    }
    /* <div className="tokenId-0" >
    {document.body.innerHTML = decodeURIComponent(escape(window.atob(this.state.token.slice(29,))))}
    </div> */


    // <div>{axios.get(decodeURIComponent(atob(this.state.token.slice(29,))))}</div>
    // <img src={this.state.img}></img>
    // <object type="JSON" url={this.state.token}></object>
    render() {
        return (
            <img src={this.state.img} alt="loading" />
        )
    }
}

export default Tokenid0;