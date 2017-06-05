import React, { Component } from 'react';
import ParticleSpecifier from './ParticleSpecifier';
import ForceSpecifier from './ForceSpecifier';

class SystemSpecifier extends Component {
  render() {
    const system = this.props.system;
    const particles = system.particles();
    const updateSystem = this.props.updateSystem;
    const forces = system.forces();

    return (
      <div className="system-specifier">
        <p>Specify your system here!</p>
        <h3>Particles</h3>
        {particles.map((p, idx) =>
          <ParticleSpecifier key={idx} particle={p} updateSystem={updateSystem} system={system} />)
        }
        <button onClick={() => updateSystem((s) => s.addParticle())}>Add particle</button>
        <div>
          <label>
            <input type="checkbox" checked={system.gravity()}
              onChange={() => updateSystem((s) => s.toggleGravity()) } />
              Newtownian gravity
          </label>
        </div>

        <h3>Other forces</h3>
        {forces.map((f, idx) =>
          <ForceSpecifier key={idx} force={f} updateSystem={updateSystem} system={system} />)
        }
      </div>
    );
  }
}


export default SystemSpecifier;
