import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SystemSpecifier from './SystemSpecifier.js'
import SystemStore from './SystemStore.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      system: Immutable.Map({
        particles: Immutable.List(),
        gravity: true,
        forces: Immutable.List()
      })
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <SystemSpecifier
          system={this.state.system}
          updateSystem={(f) => this.updateSystem(f)} />
      </div>
    );
  }
}

export default App;
