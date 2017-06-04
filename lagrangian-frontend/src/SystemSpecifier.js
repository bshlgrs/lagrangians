import React, { Component } from 'react';

class SystemSpecifier extends Component {
  render() {
    const system = this.props.system;
    const particles = system.get('particles');
    return (
      <div className="App">
        <p>Specify your system here!</p>
        <h3>Particles</h3>
        {particles.map((x, idx) => <ParticleSpecifier particle={x} />)}
      </div>
    );
  }
}

export default SystemSpecifier;
