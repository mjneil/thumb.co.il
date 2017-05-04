import React, { Component } from 'react';
import FileLoader from './FileLoader/FileLoader';
import MediaContainer from './Media/MediaContainer';
import ManifestContainer from './Manifest/ManifestContainer';
import Load from './LoaderUtils'
import logo from './thumbcoil_logo.svg';
import './App.css';

const initialState = function() {
  return {
    media: null,
    manifest: null
  };
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState();

    this.requestLoad = this.requestLoad.bind(this);
    this.selectMedia = this.selectMedia.bind(this);
  }

  requestLoad(requestInfo) {
    const location = requestInfo.location;
    const reset = requestInfo.reset;

    Load[location](requestInfo.options, (...args) => {
      if (reset) {
        this.setState(initialState());
      }

      this[location + 'Loadend'](...args);
    });
  }

  localLoadend(data) {
    if (/\.m3u8/i.test(data.name)) {
      this.loadedManifest(data);
    } else if(/\.ts/i.test(data.name)){
      this.loadedTS(data);
    }
  }

  remoteLoadend(error, response) {
    const data = {
      name: response.url,
      data: response.body
    };

    this.localLoadend(data);
  }

  loadedManifest(data) {
    this.setState({
      manifest: {
        uri: data.name,
        text: data.data
      }
    });
  }

  loadedTS(data) {
    this.setState({
      media: {
        bytes: new Uint8Array(data.data),
        name: data.name
      }
    });
  }

  selectMedia(media) {
    const requestInfo = {
      options: {
        url: media.resolvedUri,
        headers: media.xhrHeaders
      },
      location: 'remote',
      reset: false
    };

    this.requestLoad(requestInfo);
  }

  render() {
    let appContent;

    if (this.state.manifest || this.state.media) {
      appContent = (
        <div className="App-content">
          {this.state.manifest && <ManifestContainer manifest={this.state.manifest} selectMedia={this.selectMedia} /> }
          {this.state.media && <MediaContainer name={this.state.media.name} bytes={this.state.media.bytes} /> }
        </div>
      );
    } else {
      appContent = (
        <div className="App-content">
          <div className="App-no-content">
            <div>Load a media file or stream manifest to start.</div>
            <div>Thumbcoil runs entirely within the browser so your video data will <strong>NOT</strong> be transmitted to a server.</div>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo">
            <img src={logo} alt="logo" />
            <h1 className="App-name">thumb.co.il</h1>
          </div>
          <div className="App-info">
            <div className="App-description">A web-based video inspector</div>
            <div className="App-sub-description">Inspect the structure of an MP4, FLV or MPEG-2 Transport Stream</div>
          </div>
          <div className="App-fileloader">
            <FileLoader requestLoad={ this.requestLoad } />
          </div>
        </div>
        {appContent}
      </div>
    );
  }
}

export default App;
