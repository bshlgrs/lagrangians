import React, { Component } from 'react';
import { NumericInput } from './InputWithValidation';

class ParticleSpecifier extends Component {
  updatePlacementType(type) {
    const updateSystem = this.props.updateSystem;
    const updateParticle = (f) => updateSystem((s) => s.updateParticle(this.props.particle.get('name'), f));

    if (type === 'free') {
      updateParticle((p) => p.setIn(['placement', 'type'], 'free'));
    } else if (type === 'constrained') {
      updateParticle((p) =>
        p.setIn(['placement', 'type'], 'constrained')
          .setIn(['placement', 'x'], 'a')
          .setIn(['placement', 'y'], 'a')
      );
    } else if (type === 'fixed-pole') {
      updateParticle((p) =>
        p.setIn(['placement', 'type'], 'pole')
         .setIn(['placement', 'origin', 'type'], 'fixed')
         .setIn(['placement', 'origin', 'x'], 0)
         .setIn(['placement', 'origin', 'y'], 0)
         .setIn(['placement', 'length'], 1)
      );
    } else {
      const particleName = type.split(" ")[1];
      updateParticle((p) =>
        p.setIn(['placement', 'type'], 'pole')
          .setIn(['placement', 'origin', 'type'], 'particle')
          .setIn(['placement', 'origin', 'particle'], particleName)
          .setIn(['placement', 'length'], 1)
      );
    }
  }

  placementTypeMenuValue() {
    const type = this.props.particle.getIn(['placement', 'type']);
    if (type === 'pole') {
      if (this.props.particle.getIn(['placement', 'origin', 'type']) === 'particle') {
        return "pole " + this.props.particle.getIn(['placement', 'origin', 'particle']);
      } else {
        return 'fixed-pole';
      }
    } else {
      return type;
    }
  }

  render () {
    const p = this.props.particle;
    const name = p.get('name');
    const updateSystem = this.props.updateSystem;
    const updateParticle = (f) => updateSystem((s) => s.updateParticle(name, f));
    const placementType = p.getIn(['placement', 'type']);

    return <div className="particle-specifier">
      <h4>Particle {p.get('name')} <button onClick={() => updateSystem((s) => s.deleteParticle(name))}>delete</button></h4>
      <label>Mass:
        <NumericInput
          initialValue={p.get('mass') || ""}
          onChange={(v) => updateParticle((p) => p.set('mass', v)) }/>
      </label>
      <div>Location:
        <select value={this.placementTypeMenuValue()}
          onChange={(e) => this.updatePlacementType(e.target.value)}>
          <option value="free">Free</option>
          <option value="constrained">Constrained</option>
          <option value="fixed-pole">Attached to a fixed point</option>
          {this.props.system.particles().map((otherP, idx) =>
            p !== otherP &&
            <option key={idx} value={`pole ${otherP.get('name')}`}>Attached to particle {otherP.get('name')}</option>
          )}
        </select>
        {placementType === 'constrained' && <div>
          <label>x(a):
            <input
              value={p.getIn(['placement', 'x']) || ""}
              onChange={(e) => updateParticle((p) => p.setIn(['placement', 'x'], e.target.value)) }/>
          </label>
          <label>y(a):
            <input
              value={p.getIn(['placement', 'y']) || ""}
              onChange={(e) => updateParticle((p) => p.setIn(['placement', 'y'], e.target.value)) }/>
          </label>
        </div>}
        {this.placementTypeMenuValue() === 'fixed-pole' && <span>
          <label>x:
            <NumericInput
              initialValue={p.getIn(['placement', 'origin', 'x']) || 0}
              onChange={(v) => updateParticle((p) => p.setIn(['placement', 'origin', 'x'], v)) }/>
          </label>
          <label>y:
            <NumericInput
              initialValue={p.getIn(['placement', 'origin', 'y']) || 0}
              onChange={(v) => updateParticle((p) => p.setIn(['placement', 'origin', 'y'], v)) }/>
          </label>
        </span>}
        {placementType === 'pole' && <div>
          <label>Length:
            <NumericInput
              initialValue={p.getIn(['placement', 'length'])}
              onChange={(v) => updateParticle((p) => p.setIn(['placement', 'length'], v)) }/>
          </label>
        </div>}
      </div>
    </div>;
  }
}

export default ParticleSpecifier;
