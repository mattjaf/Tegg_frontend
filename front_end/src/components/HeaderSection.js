import React, {Component} from "react";

class HeaderSection extends Component {
  /**
   * @param {{
   *   account: string,
   * }} props
   */
  constructor(props) {
    super(props);
    /**
     *
     * @type {{
     *   account: string,
     * }}
     */
    this.state = {
      account: props.account,
    }
  }

  /**
   *
   * @param {{
   *   account: string
   * }} nextProps
   */
  componentWillReceiveProps(nextProps){
    this.setState({account: nextProps.account});
  }

  render() {
    return (
      <div className="header-section">
        <nav className="navbar">
          <div className="nav-page-title">
            Theta Egg NFTs (Automatic hatching Tokens!)
          </div>
          <div className="nav-info-section">
            {this.state.account && <span>Account: <b>{this.state.account}</b></span>}
          </div>
        </nav>
        <div className="hero-section">
          <div className="hero-image-container">
            <img className="hero-image" alt="." src={'banner2.png'} />
          </div>
          <div className="hero-section-notes">
            Please make sure you have metamask on the Theta Test network.
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderSection;
