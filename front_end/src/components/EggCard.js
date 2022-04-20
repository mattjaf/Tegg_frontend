import React, {Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import Countdown from "react-countdown";

class EggTimerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text
    }
  }
  render() {
    return (
      <div className="hatched-message-container">
        Hatched!
      </div>
    );
  }
}

const timerMessageRenderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <EggTimerContainer />;
  } else {
    // Render a countdown
    return (
      <div className="timer-container">
        <span>{hours}:{minutes}:{seconds}</span>
      </div>);
  }
};

class EggCard extends Component {
  /**
   * @param {{
   *   account: string,
   *   contractMethods: object,
   *   nft: object,
   *   nftIndex: number,
   *   hatchTimestamp: number,
   * }} props
   */
  constructor(props) {
    super(props);

    this.state = {
      account: props.account,
      contractMethods: props.contractMethods,
      nft: props.nft,
      nftIndex: props.nftIndex,
      hatchTimestamp: props.hatchTimestamp,
      hatched: Date.now() >= props.hatchTimestamp
    }

    console.log(`Rendering NFT object for Token Index ${this.state.nftIndex}`)
    console.log(props);
  }

  render() {
    return (
      <MDBCard className="egg-card">
        <Countdown
          renderer={timerMessageRenderer}
          date={this.state.hatchTimestamp}>
          <EggTimerContainer text={'Hatched!'} />
        </Countdown>
        <MDBCardImage src={this.state.nft.data.image} className="egg-card-image" />
        <MDBCardBody>
          <MDBCardTitle>Theta Eggs</MDBCardTitle>
          <MDBCardText>
            These are automatic hatching theta eggs stored 100% on-chain.
            They will hatch in 360 days or for a small fee.
          </MDBCardText>
          <MDBBtn
            disabled={this.state.hatched}
            className="egg-card-button" onClick={async () => {
            await this.state.contractMethods.hatchEgg(this.state.nftIndex).send({from: this.state.account});
            this.setState({hatched: true});
          }}>
            {this.state.hatched ? 'Hatched!' : 'Hatch'}
          </MDBBtn>
          <MDBBtn className="egg-card-button" onClick={async () => {
            this.state.contractMethods.ResetTimer(this.state.nftIndex).send({from: this.state.account});
          }}>
            Reset test
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    )
  }
}

export default EggCard;
