import React, { Component } from 'react';
import './App.css';
import SystemSpecifier from './SystemSpecifier.js'
import ResultDisplay from './ResultDisplay.js'
import System from './System.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      system: System.blank,
      computationResult: null
    };
  }

  updateSystem(f) {
    const that = this;
    this.setState({system: f(this.state.system)}, () => {
      const json = JSON.stringify(this.state.system.map.toJSON());
      fetch("/api/calc/",
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: json
      })
      .then(function(res){ res.json().then((computationResult) => {
        that.setState({ computationResult: computationResult })
      }) })
      .catch(function(res){ console.log(res) })
    });
  }



  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Lagrangian mechanics</h2>
        </div>

        <div className="App-body">
          <SystemSpecifier
            system={this.state.system}
            updateSystem={(f) => this.updateSystem(f)} />
          <h3>Result</h3>
          {this.state.computationResult && <ResultDisplay result={this.state.computationResult}/>}
        </div>
      </div>
    );
  }
}

export default App;
