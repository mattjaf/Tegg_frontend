import React, {Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";

class EggCard extends Component {
  /**
   * @param {{
   *   account: string,
   *   contractMethods: object,
   *   nft: object,
   *   nftIndex: number,
   * }} props
   */
  constructor(props) {
    super(props);

    this.state = {
      account: props.account,
      contractMethods: props.contractMethods,
      nft: props.nft,
      nftIndex: props.nftIndex
    }
  }

  render() {
    return (
      <MDBCard className="egg-card">
        <MDBCardTitle className=""/>
        <MDBCardImage src={this.state.nft.data.image} className="egg-card-image" />
        <MDBCardBody>
          <MDBCardTitle>Theta Eggs</MDBCardTitle>
          <MDBCardText>
            These are automatic hatching theta eggs stored 100% on-chain.
            They will hatch in 360 days or for a small fee.
          </MDBCardText>
          <MDBBtn onClick={() => {
            this.state.contractMethods.hatchEgg(this.state.nftIndex).send({from: this.state.account});
          }}>Hatch</MDBBtn>
          <MDBBtn onClick={() => {
            this.state.contractMethods.ResetTimer(this.state.nftIndex).send({from: this.state.account});
          }}>Reset test</MDBBtn>
        </MDBCardBody>
      </MDBCard>
    )
  }
}

export default EggCard;
