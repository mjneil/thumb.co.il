import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import logo from './thumbcoil_logo.svg';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import './AppHeader.css';

class AppHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true
    };

    this.handleExpandTap = this.handleExpandTap.bind(this);
  }

  handleExpandTap() {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      };
    });
  }

  render() {
    const appLogo = (
      <div className="App-logo">
        <img src={logo} />
      </div>
    );
    const appInfo = (
      <div className="App-info">
        <div className="App-description">A web-based video inspector</div>
        <div className="App-sub-description">Inspect the structure of an MP4, FLV or MPEG-2 Transport Stream</div>
      </div>
    );
    const appFileloader = (
      <div className="App-fileloader">
        <FileLoader requestLoad={ this.props.requestLoad } closeDrawer={this.handleExpandTap} />
      </div>
    );
    const expandIcon = (
      <IconButton onTouchTap={this.handleExpandTap}>{this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
    );

    let appHeaderClassName = 'AppHeader';

    const barStyle = {
      fontFamily: 'Text Me One, sans-serif',
      backgroundColor: '#333'
    };

    if (this.state.open) {
      appHeaderClassName += ' AppHeader-drawer-open';
      barStyle.boxShadow = 'none';
    }

    const drawer = (
      <div className="AppHeader-drawer-container">
        <div className="AppHeader-drawer">
          {appInfo}
          {appFileloader}
        </div>
      </div>
    );

    return (
      <div className={appHeaderClassName}>
        <AppBar
          title="thumb.co.il"
          titleStyle={{
            marginLeft: '5px'
          }}
          iconElementLeft={appLogo}
          iconElementRight={expandIcon}
          style={barStyle}
        />
        {drawer}
      </div>
    );
  }
}

export default AppHeader;
