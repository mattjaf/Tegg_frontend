import React, { Component } from "react";
import EggCard from "../EggCard";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: props.account,
            contract: props.contract,
            contractMethods: props.contractMethods,
            teggNFTs: props.teggNFTs, //
            error: props.error,
            hatchTimestamps: props.hatchTimestamps,

        }
    }

    render() {
        return (
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
        )
    }
}

export default Home;