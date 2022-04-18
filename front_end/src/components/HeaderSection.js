import React, {Component} from "react";

class HeaderSection extends Component {

  async componentDidMount() {

  }

  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
    }
  }

  render() {
    return (
      <div className="header-section">
        <nav className="navbar">
          <div className="nav-page-title">
            Theta Egg NFTs (Automatic hatching Tokens!)
          </div>
          <div className="nav-info-section">
            {this.state.account}
          </div>
        </nav>
        <div className="">
          <div className="">
            <div className="hero-image-container">
              <img className="hero-image" alt="." src={'banner2.jpg'} />
            </div>
            Please make sure you have metamask on the Theta Test network.
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderSection;
